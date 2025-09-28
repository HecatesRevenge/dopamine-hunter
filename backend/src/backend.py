# backend.py
# backend makes database:
# profile
# achievements
# skill tree

from typing import Union, Optional, List
from fastapi import FastAPI
from datetime import datetime, timedelta
from pydantic import BaseModel
from fishgame import Fish

app = FastAPI()

# -------------------------
# Achievements
# -------------------------
class Achievements:
    def __init__(self, title: str, description: str, due_date: datetime = None):
        self.title = title
        self.description = description
        self.due_date = due_date if due_date else datetime.now() + timedelta(days=7)
        self.date_completed = None

    def complete(self):
        self.date_completed = datetime.now()

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
            self.current_streak = 0

class TotalTasksAchievement(Achievements):
    def __init__(self, title: str, description: str, total_required: int):
        super().__init__(title, description)
        self.total_required = total_required
        self.total_completed = 0

    def update_total(self, tasks_done_today: int):
        self.total_completed += tasks_done_today
        if self.total_completed >= self.total_required:
            self.complete()

# -------------------------
# Feeding streak achievement subclass
# -------------------------
class FeedingStreakAchievement(Achievements):
    def __init__(self, title: str, description: str, days_required: int = 7):
        super().__init__(title, description)
        self.days_required = days_required
        self.current_streak = 0

    def update_streak(self, fed_today: bool):
        if fed_today:
            self.current_streak += 1
            if self.current_streak >= self.days_required:
                self.complete()
        else:
            self.current_streak = 0

# -------------------------
# Pydantic schemas
# -------------------------
class AchievementSchema(BaseModel):
    title: str
    description: str
    due_date: datetime
    date_completed: Optional[datetime] = None

    class Config:
        orm_mode = True

class StreakAchievementSchema(AchievementSchema):
    streak_required: int
    current_streak: int

class TotalTasksAchievementSchema(AchievementSchema):
    total_required: int
    total_completed: int

# -------------------------
# In-memory storage
# -------------------------
streak_achievements: List[StreakAchievement] = []
total_task_achievements: List[TotalTasksAchievement] = []

users_fish: dict[str, List[Fish]] = {}
users_feed_achievements: dict[str, FeedingStreakAchievement] = {}

# -------------------------
# Achievement endpoints
# -------------------------
@app.post("/streak_achievements", response_model=StreakAchievementSchema)
def create_streak_achievement(title: str, description: str, streak_required: int):
    ach = StreakAchievement(title, description, streak_required)
    streak_achievements.append(ach)
    return ach

@app.post("/total_task_achievements", response_model=TotalTasksAchievementSchema)
def create_total_task_achievement(title: str, description: str, total_required: int):
    ach = TotalTasksAchievement(title, description, total_required)
    total_task_achievements.append(ach)
    return ach

@app.post("/streak_achievements/{index}/update", response_model=StreakAchievementSchema)
def update_streak(index: int, did_task_today: bool):
    try:
        ach = streak_achievements[index]
        ach.update_streak(did_task_today)
        return ach
    except IndexError:
        return {"error": "Achievement not found"}

@app.post("/total_task_achievements/{index}/update", response_model=TotalTasksAchievementSchema)
def update_total_tasks(index: int, tasks_done_today: int):
    try:
        ach = total_task_achievements[index]
        ach.update_total(tasks_done_today)
        return ach
    except IndexError:
        return {"error": "Achievement not found"}

@app.get("/streak_achievements", response_model=List[StreakAchievementSchema])
def get_streak_achievements():
    return streak_achievements

@app.get("/total_task_achievements", response_model=List[TotalTasksAchievementSchema])
def get_total_task_achievements():
    return total_task_achievements

# -------------------------
# Fish endpoints
# -------------------------
@app.post("/users/{user_id}/fish")
def create_fish(user_id: str, name: str, category: str):
    fish = Fish(name, category)
    users_fish.setdefault(user_id, []).append(fish)
    return {"name": fish.name, "category": fish.category, "level": fish.level, "xp": fish.xp, "feed_meter": fish.feed_meter}

@app.post("/users/{user_id}/fish/{fish_index}/complete_task")
def complete_task(user_id: str, fish_index: int, num_tasks: int = 1):
    fish = users_fish[user_id][fish_index]
    fish.complete_task(num_tasks)
    return {"name": fish.name, "level": fish.level, "xp": fish.xp}

@app.post("/users/{user_id}/fish/{fish_index}/complete_achievement")
def complete_achievement(user_id: str, fish_index: int):
    fish = users_fish[user_id][fish_index]
    fish.complete_achievement()
    return {"name": fish.name, "level": fish.level, "xp": fish.xp, "achievements_completed": fish.achievements_completed}

# -------------------------
# Feed all fishes
# -------------------------
@app.post("/users/{user_id}/feed_all")
def feed_all_fish(user_id: str):
    if user_id not in users_fish:
        return {"error": "No fishes found for this user."}

    fed_today = False
    for fish in users_fish[user_id]:
        if fish.alive:
            fish.feed()
            fed_today = True

    # Update feeding streak achievement
    if user_id not in users_feed_achievements:
        users_feed_achievements[user_id] = FeedingStreakAchievement(
            title="Dedicated Fish Keeper",
            description="Feed all your fishes every day for a week."
        )
    users_feed_achievements[user_id].update_streak(fed_today)

    return {
        "message": "All fishes fed!",
        "feed_streak": users_feed_achievements[user_id].current_streak,
        "achievement_completed": users_feed_achievements[user_id].date_completed is not None
    }

# -------------------------
# Daily check for feed meters
# -------------------------
@app.post("/users/{user_id}/daily_feed_check")
def daily_feed_check(user_id: str):
    if user_id not in users_fish:
        return {"error": "No fishes found for this user."}

    deaths = 0
    for fish in users_fish[user_id]:
        fish.daily_feed_check()
        if not fish.alive:
            deaths += 1

    return {"deaths_today": deaths}

# -------------------------
# Get all user fishes with status
# -------------------------
@app.get("/users/{user_id}/fishes")
def get_user_fishes(user_id: str):
    if user_id not in users_fish:
        return {"error": "No fishes found for this user."}
    result = []
    for fish in users_fish[user_id]:
        result.append({
            "name": fish.name,
            "category": fish.category,
            "level": fish.level,
            "xp": fish.xp,
            "feed_meter": fish.feed_meter,
            "alive": fish.alive,
            "achievements_completed": fish.achievements_completed
        })
    return result
