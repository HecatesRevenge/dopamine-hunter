from fastapi import APIRouter, HTTPException, Query
from ..models import Achievement
from ..db.storage import achievements
from ..core.exceptions import AchievementNotFoundError

router = APIRouter()

@router.get("/", response_model=list[Achievement])
async def get_achievements_endpoint(user_id: int | None = Query(None)):
    """Get all achievements, optionally filtered by user_id"""
    if user_id:
        return [achievement for achievement in achievements.values() if achievement.user_id == user_id]
    return list(achievements.values())

@router.get("/{achievement_id}", response_model=Achievement)
async def get_achievement_endpoint(achievement_id: int):
    """Get a specific achievement by ID"""
    achievement = achievements.get(achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement
