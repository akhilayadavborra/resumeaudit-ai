"""
User profile routes: get/update profile, change password.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_user
from app.core.database import get_database
from app.core.security import verify_password, hash_password
from app.schemas.user import UserOut, UpdateProfileRequest
from app.schemas.auth import ChangePasswordRequest

router = APIRouter(prefix="/api/auth", tags=["User Profile"])


def _serialize_user(user: dict) -> UserOut:
    return UserOut(id=str(user["_id"]), full_name=user["full_name"], email=user["email"], created_at=user["created_at"])


@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user)):
    return _serialize_user(current_user)


@router.put("/me", response_model=UserOut)
async def update_profile(payload: UpdateProfileRequest, current_user=Depends(get_current_user), db=Depends(get_database)):
    update_fields = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if update_fields:
        await db.users.update_one({"_id": current_user["_id"]}, {"$set": update_fields})
    updated = await db.users.find_one({"_id": current_user["_id"]})
    return _serialize_user(updated)


@router.post("/change-password")
async def change_password(payload: ChangePasswordRequest, current_user=Depends(get_current_user), db=Depends(get_database)):
    if not verify_password(payload.current_password, current_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await db.users.update_one({"_id": current_user["_id"]}, {"$set": {"hashed_password": hash_password(payload.new_password)}})
    return {"message": "Password updated successfully"}