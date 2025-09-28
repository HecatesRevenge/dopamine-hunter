from fastapi import APIRouter, HTTPException
from datetime import datetime
from ..models import Profile
from ..db.database import get_profiles, create_profile, get_profile_by_id

router = APIRouter()

@router.get("/", response_model=list[Profile])
async def get_profiles_endpoint():
    """Get all profiles"""
    return get_profiles()

@router.post("/", response_model=Profile)
async def create_profile_endpoint(profile: Profile):
    """Create a new profile"""
    profile.created_at = datetime.now()
    return create_profile(profile)

@router.get("/{profile_id}", response_model=Profile)
async def get_profile_endpoint(profile_id: int):
    """Get a specific profile by ID"""
    profile = get_profile_by_id(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
