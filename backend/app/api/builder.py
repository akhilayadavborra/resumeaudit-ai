"""
Resume Builder routes: generates a downloadable ATS-friendly resume
(DOCX or PDF) from structured user input, and provides bullet-quality
feedback before generation.
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import io

from app.core.dependencies import get_current_user
from app.schemas.builder import ResumeBuilderData
from app.services.resume_builder import generate_docx_resume, generate_pdf_resume, check_bullet_quality
from fastapi import UploadFile, File, Form
from app.schemas.builder import GenerateFromDetailsRequest, TailorResumeRequest, ResumeBuilderData
from app.services.ai_writer import generate_resume_from_details, tailor_resume_to_job
from app.services.parser import extract_resume_text
router = APIRouter(prefix="/api/builder", tags=["Resume Builder"])


@router.post("/check-bullet")
async def check_bullet(bullet: str, current_user=Depends(get_current_user)):
    """Real-time feedback on a single bullet point while the user types it."""
    return check_bullet_quality(bullet)


@router.post("/generate/docx")
async def generate_docx(data: ResumeBuilderData, current_user=Depends(get_current_user)):
    file_bytes = generate_docx_resume(data)
    filename = f"{data.full_name.replace(' ', '_')}_Resume.docx"
    return StreamingResponse(
        io.BytesIO(file_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/generate/pdf")
async def generate_pdf(data: ResumeBuilderData, current_user=Depends(get_current_user)):
    file_bytes = generate_pdf_resume(data)
    filename = f"{data.full_name.replace(' ', '_')}_Resume.pdf"
    return StreamingResponse(
        io.BytesIO(file_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
@router.post("/ai-generate")
async def ai_generate(payload: GenerateFromDetailsRequest, current_user=Depends(get_current_user)):
    """
    Takes rough builder input + optional free-text notes and returns
    AI-polished resume content (summary + rewritten bullets), which the
    frontend then merges back with contact info and sends to /generate/pdf or /docx.
    """
    ai_content = generate_resume_from_details(payload.raw_data.dict(), payload.notes)
    return ai_content


@router.post("/tailor")
async def tailor_resume(
    file: UploadFile = File(...), job_description: str = Form(None),
    current_user=Depends(get_current_user),
):
    """
    Uploads an existing resume + a target job description, and returns a
    fully tailored, AI-rewritten resume structure ready for PDF/DOCX generation.
    """
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    file_bytes = await file.read()
    resume_text = extract_resume_text(file.filename, file_bytes)
    tailored = tailor_resume_to_job(resume_text, job_description)
    return tailored