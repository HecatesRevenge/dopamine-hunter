from fastapi import APIRouter
from . import profiles, tasks, achievements

api_router = APIRouter()

api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
