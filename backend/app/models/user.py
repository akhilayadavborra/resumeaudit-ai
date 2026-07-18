"""
Reference shape for a 'users' collection document in MongoDB.
(MongoDB documents are plain dicts — this class documents the expected shape,
it isn't an ORM model.)
"""
from datetime import datetime


class UserDocument:
    full_name: str
    email: str
    hashed_password: str
    created_at: datetime