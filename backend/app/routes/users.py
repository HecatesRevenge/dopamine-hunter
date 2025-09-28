from fastapi import APIRouter, HTTPException
from ..models import User, UserCreate
from ..db.storage import users
from ..services.id_service import id_service
from ..services.user_service import UserService
from ..core.exceptions import UserNotFoundError, DuplicateUsernameError
from ..core.logging import logger
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=list[User])
async def get_users_endpoint():
    """Get all users"""
    logger.info("Retrieving all users")
    return list(users.values())

@router.post("/", response_model=User)
async def create_user_endpoint(user: UserCreate):
    """Create a new user"""
    logger.info(f"Creating new user: {user.username}")
    
    # Check for duplicate username
    for existing_user in users.values():
        if existing_user.username == user.username:
            logger.warning(f"Attempted to create user with existing username: {user.username}")
            raise HTTPException(
                status_code=400, 
                detail="Username already exists"
            )
    
    user_obj = User(id=id_service.generate_user_id(), username=user.username)
    users[user_obj.id] = user_obj
    logger.info(f"Successfully created user with ID: {user_obj.id}")
    return user_obj

@router.get("/{user_id}", response_model=User)
async def get_user_endpoint(user_id: int):
    """Get a specific user by ID"""
    logger.info(f"Retrieving user with ID: {user_id}")
    user = users.get(user_id)
    if not user:
        logger.warning(f"User not found with ID: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/{user_id}/login", response_model=User) #pen + ai addition
async def login_endpoint(user_id: int):
    """Simple login endpoint that updates last_login and login_streak for the user.

    Note: This is a placeholder for a real authentication flow. Replace with proper
    password checks and token issuance in a production app.
    """
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    UserService.update_login_streak(user)
    return user


@router.post("/{user_id}/streak/visit")
async def streak_visit(user_id: int):
    """Record a streak visit and return streak stats.

    Follows the contract in frontend-documentation/backend-integration.md
    """
    stats = UserService.record_streak_visit(user_id)
    if stats is None:
        raise HTTPException(status_code=404, detail="User not found")
    return stats

@router.get("/{user_id}/streak/streak")
async def get_streak(user_id: int):
    """Get the current login streak for a user."""
    stats = UserService.get_streak(user_id)
    if stats is None:
        raise HTTPException(status_code=404, detail="User not found")
    return stats

@router.get("/{user_id}/stats/last-visit")
async
def get_last_visit(user_id: int):
    """Get the last visit date for a user."""
    stats = UserService.get_last_visit(user_id)
    if stats is None:
        raise HTTPException(status_code=404, detail="User not found")
    return stats