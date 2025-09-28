from fastapi import APIRouter, HTTPException
from ..models import Fish, FishCreate
from ..db.storage import users, fishes
from ..services.id_service import id_service
from ..services.fish_service import FishService
from ..core.exceptions import UserNotFoundError, FishNotFoundError

router = APIRouter()

@router.post("/users/{user_id}/fish", response_model=Fish)
async def create_fish_endpoint(user_id: int, fish: FishCreate):
    """Create a new fish for a user"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    fish_obj = Fish(
        id=id_service.generate_fish_id(), 
        name=fish.name, 
        category=fish.category, 
        user_id=user_id
    )
    user.fishes[fish_obj.id] = fish_obj
    fishes[fish_obj.id] = fish_obj
    return fish_obj

@router.post("/users/{user_id}/fish/{fish_id}/complete_task", response_model=Fish)
async def complete_task_endpoint(user_id: int, fish_id: int, num_tasks: int = 1):
    """Complete tasks for a fish"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    fish = user.fishes.get(fish_id)
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")

    # Use service layer for business logic
    FishService.complete_task(fish, num_tasks)
    return fish

@router.post("/users/{user_id}/fish/{fish_id}/complete_achievement", response_model=Fish)
async def complete_achievement_endpoint(user_id: int, fish_id: int):
    """Complete an achievement for a fish"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    fish = user.fishes.get(fish_id)
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")

    # Use service layer for business logic
    FishService.complete_achievement(fish)
    return fish

@router.post("/users/{user_id}/feed_all")
async def feed_all_fish_endpoint(user_id: int):
    """Feed all fishes for a user"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    fed_today = False
    for fish in user.fishes.values():
        if fish.alive:
            FishService.feed(fish)
            fed_today = True

    return {
        "message": "All fishes fed!",
        "fishes_fed": len([f for f in user.fishes.values() if f.alive]),
        "fed_today": fed_today
    }

@router.post("/users/{user_id}/daily_feed_check")
async def daily_feed_check_endpoint(user_id: int):
    """Perform daily feed check for all user's fishes"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    deaths = 0
    for fish in user.fishes.values():
        FishService.daily_feed_check(fish)
        if not fish.alive:
            deaths += 1

    return {"deaths_today": deaths}

@router.get("/users/{user_id}/fishes", response_model=list[Fish])
async def get_user_fishes_endpoint(user_id: int):
    """Get all fishes for a user"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return list(user.fishes.values())