from fastapi import APIRouter, HTTPException
from ..models import User, UserCreate
from ..db.storage import users
from ..services.id_service import id_service
from ..core.exceptions import UserNotFoundError, DuplicateUsernameError
from ..core.logging import logger

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
