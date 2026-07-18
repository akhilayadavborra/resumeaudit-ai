"""
Pydantic schemas for resume analysis requests/responses.
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class AnalysisSummary(BaseModel):
    id: str
    filename: str
    ats_score: float
    created_at: datetime
    job_description_provided: bool


class AnalysisDetail(BaseModel):
    id: str
    filename: str
    ats_score: float
    score_breakdown: Dict[str, float]
    sections_detected: Dict[str, bool]
    missing_sections: List[str]
    contact_info: Dict[str, Optional[str]]
    skills_detected: List[str]
    keywords_detected: List[str]
    formatting_issues: List[Dict[str, Any]]
    line_level_suggestions: List[Dict[str, Any]] = []
    estimated_years_experience: float
    job_match: Dict[str, Any]
    role_match: Optional[Dict[str, Any]] = None
    suggestions: List[str]
    created_at: datetime
class ComparisonSide(BaseModel):
    id: str
    filename: str
    ats_score: float
    created_at: datetime


class ComparisonResult(BaseModel):
    from_analysis: ComparisonSide
    to_analysis: ComparisonSide
    score_delta: float
    skills_gained: List[str]
    skills_lost: List[str]
    issues_resolved: List[str]
    issues_persisting: List[str]
    new_issues: List[str]