from pydantic import BaseModel, Field, validator
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

# For sending to the task create route
class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.PENDING

class Task(BaseModel):
    id: int | None = None
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = datetime.now()
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

# For sending to the fish create route
class FishCreate(BaseModel):
    name: str
    category: str

class Fish(BaseModel):
    id: int | None = None
    name: str = Field(..., min_length=1, max_length=50)
    category: str = Field(..., min_length=1, max_length=30)
    user_id: int
    level: int = Field(default=1, ge=1)
    xp: int = Field(default=0, ge=0)
    achievements_completed: int = Field(default=0, ge=0)
    tasks_completed: int = Field(default=0, ge=0)
    feed_meter: int = Field(default=5, ge=0, le=10)
    last_fed: datetime | None = None
    alive: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

# For sending to the user create route
class UserCreate(BaseModel):
    username: str
class User(BaseModel):
    id: int
    username: str
    profile_pic: str | None = None
    created_at: datetime = datetime.now()
    tasks: dict[int, Task] = Field(default_factory=dict)
    achievements: dict[int, Achievement] = Field(default_factory=dict)
    fishes: dict[int, Fish] = Field(default_factory=dict)
