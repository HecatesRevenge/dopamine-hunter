from fastapi import APIRouter
from . import users, tasks, achievements

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
