"""
Pydantic schemas for the Resume Builder feature — structured input
collected step-by-step from the user, used to generate a formatted,
ATS-friendly resume file (PDF and/or DOCX).
"""
from pydantic import BaseModel, EmailStr
from typing import List, Optional



class ExperienceEntry(BaseModel):
    company: str
    title: str
    start_date: str
    end_date: str = "Present"
    bullets: List[str] = []


class EducationEntry(BaseModel):
    school: str
    degree: str
    start_date: str = ""
    end_date: str = ""


class ProjectEntry(BaseModel):
    name: str
    description: str = ""
    bullets: List[str] = []


class ResumeBuilderData(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = ""
    linkedin: Optional[str] = ""
    summary: Optional[str] = ""
    experience: List[ExperienceEntry] = []
    education: List[EducationEntry] = []
    skills: List[str] = []
    projects: List[ProjectEntry] = []
    certifications: List[str] = []
    job_description: Optional[str] = None  # used to prioritize relevant skills
class GenerateFromDetailsRequest(BaseModel):
    raw_data: ResumeBuilderData
    notes: Optional[str] = ""


class TailorResumeRequest(BaseModel):
    job_description: str