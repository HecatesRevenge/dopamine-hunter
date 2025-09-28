from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from ..models import Achievement
from ..db.database import (
    get_achievements, create_achievement, 
    get_achievement_by_id, update_achievement
)

router = APIRouter()

@router.get("/", response_model=list[Achievement])
async def get_achievements_endpoint(user_id: int | None = Query(None)):
    """Get all achievements, optionally filtered by user_id"""
    return get_achievements(user_id)

@router.post("/", response_model=Achievement)
async def create_achievement_endpoint(achievement: Achievement):
    """Create a new achievement"""
    achievement.created_at = datetime.now()
    return create_achievement(achievement)

@router.get("/{achievement_id}", response_model=Achievement)
async def get_achievement_endpoint(achievement_id: int):
    """Get a specific achievement by ID"""
    achievement = get_achievement_by_id(achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

@router.put("/{achievement_id}", response_model=Achievement)
async def update_achievement_endpoint(achievement_id: int, achievement_update: Achievement):
    """Update an achievement"""
    if achievement_update.is_completed:
        achievement_update.completed_at = datetime.now()
    
    updated_achievement = update_achievement(achievement_id, achievement_update)
    if not updated_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return updated_achievement
