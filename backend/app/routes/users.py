from fastapi import APIRouter, HTTPException
from datetime import datetime
from ..models import User
from ..db.database import get_users, create_user, get_user_by_id
from ..db.database import get_user_by_username, update_user #pen + ai addition
from ..db.database import record_streak_visit

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


@router.post("/login", response_model=User) #pen + ai addition
async def login_endpoint(username: str):
    """Simple login endpoint that updates last_login and login_streak for the user.

    Note: This is a placeholder for a real authentication flow. Replace with proper
    password checks and token issuance in a production app.
    """
    user = get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.now()
    # simple streak logic: if last_login is yesterday or earlier, increase streak, else reset
    if user.last_login:
        delta = now.date() - user.last_login.date()
        if delta.days == 1:
            user.login_streak = (user.login_streak or 0) + 1
        elif delta.days > 1:
            user.login_streak = 1
    else:
        user.login_streak = 1

    user.last_login = now
    updated = update_user(user.id, user)
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update user")
    return updated


@router.post("/{user_id}/streak/visit")
async def streak_visit(user_id: int):
    """Record a streak visit and return streak stats.

    Follows the contract in frontend-documentation/backend-integration.md
    """
    stats = record_streak_visit(user_id)
    if stats is None:
        raise HTTPException(status_code=404, detail="User not found")
    return stats
