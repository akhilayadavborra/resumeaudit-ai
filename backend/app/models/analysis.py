"""
Reference shape for an 'analyses' collection document in MongoDB.
"""
from datetime import datetime
from bson import ObjectId


class AnalysisDocument:
    user_id: ObjectId
    filename: str
    resume_text: str
    job_description: str
    ats_score: float
    score_breakdown: dict
    sections_detected: dict
    missing_sections: list
    contact_info: dict
    skills_detected: list
    keywords_detected: list
    formatting_issues: list
    estimated_years_experience: float
    job_match: dict
    suggestions: list
    created_at: datetime