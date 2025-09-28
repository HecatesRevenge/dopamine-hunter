# backend makes database:
# profile
# achievements
# skill tree
from typing import Union, Optional
from fastapi import FastAPI
from datetime import datetime, timedelta
from pydantic import BaseModel
from fishgame import Fish

app = FastAPI()

class Achievements:
    def __init__(self, title: str, description: str, due_date: datetime = None):
        self.title = title
        self.description = description  # If no due_date is provided, default to 7 days from now
        self.due_date = due_date if due_date else datetime.now() + timedelta(days=7)
        self.date_completed = None  # None until the achievement is completed

    def complete(self):
        self.date_completed = datetime.now()  # mark completion with current time

class StreakAchievement(Achievements):
    def __init__(self, title: str, description: str, streak_required: int):
        super().__init__(title, description)
        self.streak_required = streak_required
        self.current_streak = 0
    
    def update_streak(self, did_task_today: bool):
        if did_task_today:
            self.current_streak += 1
            if self.current_streak >= self.streak_required:
                self.complete()
        else:
            self.current_streak = 0  # streak broken
    
    # Subclass for total tasks achievement
class TotalTasksAchievement(Achievements):
    def __init__(self, title: str, description: str, total_required: int):
        super().__init__(title, description)
        self.total_required = total_required
        self.total_completed = 0

    def update_total(self, tasks_done_today: int):
        self.total_completed += tasks_done_today
        if self.total_completed >= self.total_required:
            self.complete()
    
class AchievementSchema(BaseModel):
    title: str
    description: str
    due_date: datetime
    date_completed: Optional[datetime] = None

    class Config:
        orm_mode = True  # Needed for FastAPI to serialize class instances

class StreakAchievementSchema(AchievementSchema):
    streak_required: int
    current_streak: int

class TotalTasksAchievementSchema(AchievementSchema):
    total_required: int
    total_completed: int

# In-memory storage
streak_achievements = []
total_task_achievements = []

# -------------------------
# Create new streak achievement
# -------------------------
@app.post("/streak_achievements", response_model=StreakAchievementSchema)
def create_streak_achievement(title: str, description: str, streak_required: int):
    ach = StreakAchievement(title, description, streak_required)
    streak_achievements.append(ach)
    return ach

# -------------------------
# Create new total tasks achievement
# -------------------------
@app.post("/total_task_achievements", response_model=TotalTasksAchievementSchema)
def create_total_task_achievement(title: str, description: str, total_required: int):
    ach = TotalTasksAchievement(title, description, total_required)
    total_task_achievements.append(ach)
    return ach

# -------------------------
# Update streak progress
# -------------------------
@app.post("/streak_achievements/{index}/update", response_model=StreakAchievementSchema)
def update_streak(index: int, did_task_today: bool):
    try:
        ach = streak_achievements[index]
        ach.update_streak(did_task_today)
        return ach
    except IndexError:
        return {"error": "Achievement not found"}

# -------------------------
# Update total tasks progress
# -------------------------
@app.post("/total_task_achievements/{index}/update", response_model=TotalTasksAchievementSchema)
def update_total_tasks(index: int, tasks_done_today: int):
    try:
        ach = total_task_achievements[index]
        ach.update_total(tasks_done_today)
        return ach
    except IndexError:
        return {"error": "Achievement not found"}

# -------------------------
# Get all streak achievements
# -------------------------
@app.get("/streak_achievements", response_model=list[StreakAchievementSchema])
def get_streak_achievements():
    return streak_achievements

# -------------------------
# Get all total task achievements
# -------------------------
@app.get("/total_task_achievements", response_model=list[TotalTasksAchievementSchema])
def get_total_task_achievements():
    return total_task_achievements

# In-memory storage for simplicity
users_fish = {}

# -------------------------
# Update fishes categories
# -------------------------
@app.post("/users/{user_id}/fish")
def create_fish(user_id: str, name: str, category: str):
    fish = Fish(name, category)
    users_fish.setdefault(user_id, []).append(fish)
    return {"name": fish.name, "category": fish.category, "level": fish.level, "xp": fish.xp}

# -------------------------
# Update fish tasks
# -------------------------
@app.post("/users/{user_id}/fish/{fish_index}/complete_task")
def complete_task(user_id: str, fish_index: int, num_tasks: int = 1):
    fish = users_fish[user_id][fish_index]
    fish.complete_task(num_tasks)
    return {"name": fish.name, "level": fish.level, "xp": fish.xp}

# -------------------------
# Update fish achievements
# -------------------------
@app.post("/users/{user_id}/fish/{fish_index}/complete_achievement")
def complete_achievement(user_id: str, fish_index: int):
    fish = users_fish[user_id][fish_index]
    fish.complete_achievement()
    return {"name": fish.name, "level": fish.level, "xp": fish.xp, "achievements_completed": fish.achievements_completed}