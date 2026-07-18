"""
Pydantic schemas for user profile data.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    created_at: datetime


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=80)