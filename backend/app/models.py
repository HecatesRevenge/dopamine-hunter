from __future__ import annotations
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

# Enums
class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class AchievementType(str, Enum):
    STREAK = "streak"
    TOTAL_TASKS = "total_tasks"
    CUSTOM = "custom"

# Pydantic Models
class User(BaseModel):
    id: int | None = None
    username: str
    profile_pic: str | None = None
    created_at: datetime | None = None
    tasks: list["Task"] = Field(default_factory=list)
    achievements: list["Achievement"] = Field(default_factory=list)
    login_streak: int = 0
    # last time the user successfully logged in
    last_login: datetime | None = None
    # total number of page visits recorded for streaks
    total_visits: int = 0
    # best (highest) daily streak achieved
    best_streak: int = 0


class Task(BaseModel):
    id: int | None = None
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime | None = None
    completed_at: datetime | None = None
    user_id: int

class Achievement(BaseModel):
    id: int | None = None
    title: str
    description: str
    achievement_type: AchievementType
    is_completed: bool = False
    created_at: datetime | None = None
    completed_at: datetime | None = None
    user_id: int
    
    # For streak achievements
    streak_required: int | None = None
    current_streak: int | None = 0
    
    # For total tasks achievements
    total_required: int | None = None
    total_completed: int | None = 0
