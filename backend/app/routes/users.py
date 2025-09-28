from fastapi import APIRouter, HTTPException
from datetime import datetime
from ..models import User
from ..db.database import get_users, create_user, get_user_by_id

router = APIRouter()

@router.get("/", response_model=list[User])
async def get_users_endpoint():
    """Get all users"""
    return get_users()

@router.post("/", response_model=User)
async def create_user_endpoint(user: User):
    """Create a new user"""
    user.created_at = datetime.now()
    return create_user(user)

@router.get("/{user_id}", response_model=User)
async def get_user_endpoint(user_id: int):
    """Get a specific user by ID"""
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
