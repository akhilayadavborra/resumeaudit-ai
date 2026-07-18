"""
Authentication routes: signup, login, refresh, forgot/reset password, logout.
"""
import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from app.core.database import get_database
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from app.schemas.auth import GoogleLoginRequest
from app.schemas.auth import (
    UserSignup, UserLogin, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest,
)
from app.schemas.user import UserOut

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def _serialize_user(user: dict) -> UserOut:
    return UserOut(id=str(user["_id"]), full_name=user["full_name"], email=user["email"], created_at=user["created_at"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignup, db=Depends(get_database)):
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    user_doc = {
        "full_name": payload.full_name.strip(),
        "email": payload.email.lower(),
        "hashed_password": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    access_token = create_access_token(subject=str(user_doc["_id"]))
    refresh_token = create_refresh_token(subject=str(user_doc["_id"]))
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=_serialize_user(user_doc))


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db=Depends(get_database)):
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(subject=str(user["_id"]))
    refresh_token = create_refresh_token(subject=str(user["_id"]))
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=_serialize_user(user))
@router.post("/google-login", response_model=TokenResponse)
async def google_login(payload: GoogleLoginRequest, db=Depends(get_database)):
    """
    Verifies a Google ID token from the frontend's Google Sign-In button,
    then finds or creates a matching user and issues our own JWT tokens.
    """
    try:
        idinfo = google_id_token.verify_oauth2_token(
            payload.id_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = idinfo.get("email")
    full_name = idinfo.get("name", email.split("@")[0] if email else "User")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    user = await db.users.find_one({"email": email.lower()})

    if not user:
        user_doc = {
            "full_name": full_name,
            "email": email.lower(),
            "hashed_password": hash_password(secrets.token_urlsafe(32)),
            "auth_provider": "google",
            "created_at": datetime.now(timezone.utc),
        }
        result = await db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc

    access_token = create_access_token(subject=str(user["_id"]))
    refresh_token = create_refresh_token(subject=str(user["_id"]))
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=_serialize_user(user))

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str, db=Depends(get_database)):
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token(subject=str(user["_id"]))
    new_refresh = create_refresh_token(subject=str(user["_id"]))
    return TokenResponse(access_token=new_access, refresh_token=new_refresh, user=_serialize_user(user))


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db=Depends(get_database)):
    user = await db.users.find_one({"email": payload.email.lower()})
    generic_response = {"message": "If that email is registered, a reset link has been sent."}
    if not user:
        return generic_response

    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
    await db.password_resets.insert_one({"token": reset_token, "user_id": user["_id"], "expires_at": expires_at})

    reset_link = f"{settings.cors_origins[0]}/reset-password?token={reset_token}"
    print(f"[DEV] Password reset link for {user['email']}: {reset_link}")  # No SMTP configured yet — logged instead
    return generic_response


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db=Depends(get_database)):
    reset_doc = await db.password_resets.find_one({"token": payload.token})
    if not reset_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    expires_at = reset_doc["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    await db.users.update_one({"_id": reset_doc["user_id"]}, {"$set": {"hashed_password": hash_password(payload.new_password)}})
    await db.password_resets.delete_one({"_id": reset_doc["_id"]})
    return {"message": "Password has been reset successfully"}


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}