"""
Dashboard analytics: aggregates a user's analysis history for charts.
"""
from fastapi import APIRouter, Depends
from collections import Counter
from app.core.dependencies import get_current_user
from app.core.database import get_database

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard_stats(current_user=Depends(get_current_user), db=Depends(get_database)):
    cursor = db.analyses.find({"user_id": current_user["_id"]}).sort("created_at", 1)
    analyses = [doc async for doc in cursor]

    if not analyses:
        return {"total_analyses": 0, "average_score": 0, "highest_score": 0, "latest_score": 0,
                "score_trend": [], "top_skills": [], "score_distribution": {"excellent": 0, "good": 0, "fair": 0, "poor": 0}}

    scores = [a["ats_score"] for a in analyses]
    all_skills = Counter()
    for a in analyses:
        all_skills.update(a.get("skills_detected", []))

    distribution = {"excellent": 0, "good": 0, "fair": 0, "poor": 0}
    for s in scores:
        if s >= 80: distribution["excellent"] += 1
        elif s >= 60: distribution["good"] += 1
        elif s >= 40: distribution["fair"] += 1
        else: distribution["poor"] += 1

    score_trend = [{"date": a["created_at"].strftime("%Y-%m-%d"), "score": a["ats_score"], "filename": a["filename"]} for a in analyses[-15:]]

    return {
        "total_analyses": len(analyses), "average_score": round(sum(scores) / len(scores), 1),
        "highest_score": max(scores), "latest_score": scores[-1], "score_trend": score_trend,
        "top_skills": [{"skill": s, "count": c} for s, c in all_skills.most_common(10)],
        "score_distribution": distribution,
    }