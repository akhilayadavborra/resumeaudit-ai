"""
Resume upload, ATS analysis, history, and PDF report routes.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import StreamingResponse
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone
import io

from app.core.dependencies import get_current_user
from app.core.database import get_database
from app.core.config import settings
from app.services.parser import extract_resume_text
from app.services.ats_engine import analyze_resume
from app.services.report_generator import generate_pdf_report
from app.schemas.resume import AnalysisSummary, AnalysisDetail, ComparisonResult, ComparisonSide


router = APIRouter(prefix="/api/resume", tags=["Resume Analysis"])
ALLOWED_EXTENSIONS = (".pdf", ".docx")


def _serialize(doc: dict) -> AnalysisDetail:
    return AnalysisDetail(
        id=str(doc["_id"]), filename=doc["filename"], ats_score=doc["ats_score"],
        score_breakdown=doc["score_breakdown"], sections_detected=doc["sections_detected"],
        missing_sections=doc["missing_sections"], contact_info=doc["contact_info"],
        skills_detected=doc["skills_detected"], keywords_detected=doc["keywords_detected"],
        formatting_issues=doc["formatting_issues"], line_level_suggestions=doc.get("line_level_suggestions", []),
        estimated_years_experience=doc["estimated_years_experience"],
        job_match=doc["job_match"], role_match=doc.get("role_match"), suggestions=doc["suggestions"], created_at=doc["created_at"],
    )


@router.post("/analyze", response_model=AnalysisDetail, status_code=status.HTTP_201_CREATED)
async def analyze(
    file: UploadFile = File(...), job_description: str = Form(None), target_role: str = Form(None),
    current_user=Depends(get_current_user), db=Depends(get_database),
):
    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    file_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(status_code=413, detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE_MB}MB.")
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    resume_text = extract_resume_text(file.filename, file_bytes)
    result = analyze_resume(resume_text, job_description, target_role)

    analysis_doc = {
        "user_id": current_user["_id"], "filename": file.filename, "resume_text": resume_text,
        "job_description": job_description, "created_at": datetime.now(timezone.utc), **result,
    }
    insert_result = await db.analyses.insert_one(analysis_doc)
    analysis_doc["_id"] = insert_result.inserted_id
    return _serialize(analysis_doc)


@router.get("/history", response_model=list[AnalysisSummary])
async def get_history(current_user=Depends(get_current_user), db=Depends(get_database), limit: int = 50):
    cursor = db.analyses.find({"user_id": current_user["_id"]}).sort("created_at", -1).limit(limit)
    results = []
    async for doc in cursor:
        results.append(AnalysisSummary(
            id=str(doc["_id"]), filename=doc["filename"], ats_score=doc["ats_score"],
            created_at=doc["created_at"], job_description_provided=doc.get("job_match", {}).get("job_description_provided", False),
        ))
    return results

@router.get("/compare/{from_id}/{to_id}", response_model=ComparisonResult)
async def compare_analyses(
    from_id: str, to_id: str,
    current_user=Depends(get_current_user), db=Depends(get_database),
):
    """
    Compares two of the user's past analyses to show improvement over time:
    score change, skills gained/lost, and which issues were fixed vs. persist.
    """
    try:
        from_oid, to_oid = ObjectId(from_id), ObjectId(to_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")

    from_doc = await db.analyses.find_one({"_id": from_oid, "user_id": current_user["_id"]})
    to_doc = await db.analyses.find_one({"_id": to_oid, "user_id": current_user["_id"]})

    if not from_doc or not to_doc:
        raise HTTPException(status_code=404, detail="One or both analyses not found")

    from_skills = set(from_doc.get("skills_detected", []))
    to_skills = set(to_doc.get("skills_detected", []))

    from_issue_msgs = {i["message"] for i in from_doc.get("formatting_issues", [])}
    to_issue_msgs = {i["message"] for i in to_doc.get("formatting_issues", [])}

    return ComparisonResult(
        from_analysis=ComparisonSide(
            id=str(from_doc["_id"]), filename=from_doc["filename"],
            ats_score=from_doc["ats_score"], created_at=from_doc["created_at"],
        ),
        to_analysis=ComparisonSide(
            id=str(to_doc["_id"]), filename=to_doc["filename"],
            ats_score=to_doc["ats_score"], created_at=to_doc["created_at"],
        ),
        score_delta=round(to_doc["ats_score"] - from_doc["ats_score"], 1),
        skills_gained=sorted(to_skills - from_skills),
        skills_lost=sorted(from_skills - to_skills),
        issues_resolved=sorted(from_issue_msgs - to_issue_msgs),
        issues_persisting=sorted(from_issue_msgs & to_issue_msgs),
        new_issues=sorted(to_issue_msgs - from_issue_msgs),
    )


@router.get("/{analysis_id}", response_model=AnalysisDetail)
async def get_analysis(analysis_id: str, current_user=Depends(get_current_user), db=Depends(get_database)):
    try:
        oid = ObjectId(analysis_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")
    doc = await db.analyses.find_one({"_id": oid, "user_id": current_user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return _serialize(doc)


@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: str, current_user=Depends(get_current_user), db=Depends(get_database)):
    try:
        oid = ObjectId(analysis_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")
    result = await db.analyses.delete_one({"_id": oid, "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"message": "Analysis deleted successfully"}


@router.get("/{analysis_id}/report")
async def download_report(analysis_id: str, current_user=Depends(get_current_user), db=Depends(get_database)):
    try:
        oid = ObjectId(analysis_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid analysis ID")
    doc = await db.analyses.find_one({"_id": oid, "user_id": current_user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")

    pdf_bytes = generate_pdf_report(doc, doc["filename"])
    filename = f"ResumeAudit_Report_{doc['filename'].rsplit('.', 1)[0]}.pdf"
    return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf",
                              headers={"Content-Disposition": f'attachment; filename="{filename}"'})