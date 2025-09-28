import json
import os
from datetime import datetime
from ..models import Profile, Task, Achievement

# File paths for data storage
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
PROFILES_FILE = os.path.join(DATA_DIR, "profiles.json")
TASKS_FILE = os.path.join(DATA_DIR, "tasks.json")
ACHIEVEMENTS_FILE = os.path.join(DATA_DIR, "achievements.json")

def _ensure_data_dir():
    """Ensure the data directory exists"""
    os.makedirs(DATA_DIR, exist_ok=True)

def _load_json_file(file_path: str) -> list[dict]:
    """Load data from a JSON file, return empty list if file doesn't exist"""
    if not os.path.exists(file_path):
        return []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def _save_json_file(file_path: str, data: list[dict]):
    """Save data to a JSON file"""
    _ensure_data_dir()
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, default=str)

def _model_to_dict(model) -> dict:
    """Convert a Pydantic model to dictionary"""
    return model.model_dump()

def _dict_to_profile(data: dict) -> Profile:
    """Convert dictionary to Profile model"""
    return Profile(**data)

def _dict_to_task(data: dict) -> Task:
    """Convert dictionary to Task model"""
    return Task(**data)

def _dict_to_achievement(data: dict) -> Achievement:
    """Convert dictionary to Achievement model"""
    return Achievement(**data)

# Profile functions
def get_profiles() -> list[Profile]:
    """Get all profiles from file storage"""
    data = _load_json_file(PROFILES_FILE)
    return [_dict_to_profile(item) for item in data]

def create_profile(profile: Profile) -> Profile:
    """Create a new profile and save to file"""
    profiles = get_profiles()
    profile.id = len(profiles) + 1
    profile.created_at = datetime.now()
    
    profiles.append(profile)
    _save_json_file(PROFILES_FILE, [_model_to_dict(p) for p in profiles])
    return profile

def get_profile_by_id(profile_id: int) -> Profile | None:
    """Get a profile by ID"""
    profiles = get_profiles()
    for profile in profiles:
        if profile.id == profile_id:
            return profile
    return None

# Task functions
def get_tasks(profile_id: int | None = None) -> list[Task]:
    """Get all tasks, optionally filtered by profile_id"""
    data = _load_json_file(TASKS_FILE)
    tasks = [_dict_to_task(item) for item in data]
    
    if profile_id:
        return [task for task in tasks if task.profile_id == profile_id]
    return tasks

def create_task(task: Task) -> Task:
    """Create a new task and save to file"""
    tasks = get_tasks()
    task.id = len(tasks) + 1
    task.created_at = datetime.now()
    
    tasks.append(task)
    _save_json_file(TASKS_FILE, [_model_to_dict(t) for t in tasks])
    return task

def get_task_by_id(task_id: int) -> Task | None:
    """Get a task by ID"""
    tasks = get_tasks()
    for task in tasks:
        if task.id == task_id:
            return task
    return None

def update_task(task_id: int, task_update: Task) -> Task | None:
    """Update a task"""
    tasks = get_tasks()
    for i, task in enumerate(tasks):
        if task.id == task_id:
            task_update.id = task_id
            task_update.created_at = task.created_at
            tasks[i] = task_update
            _save_json_file(TASKS_FILE, [_model_to_dict(t) for t in tasks])
            return task_update
    return None

def delete_task(task_id: int) -> bool:
    """Delete a task"""
    tasks = get_tasks()
    for i, task in enumerate(tasks):
        if task.id == task_id:
            del tasks[i]
            _save_json_file(TASKS_FILE, [_model_to_dict(t) for t in tasks])
            return True
    return False

# Achievement functions
def get_achievements(profile_id: int | None = None) -> list[Achievement]:
    """Get all achievements, optionally filtered by profile_id"""
    data = _load_json_file(ACHIEVEMENTS_FILE)
    achievements = [_dict_to_achievement(item) for item in data]
    
    if profile_id:
        return [achievement for achievement in achievements if achievement.profile_id == profile_id]
    return achievements

def create_achievement(achievement: Achievement) -> Achievement:
    """Create a new achievement and save to file"""
    achievements = get_achievements()
    achievement.id = len(achievements) + 1
    achievement.created_at = datetime.now()
    
    achievements.append(achievement)
    _save_json_file(ACHIEVEMENTS_FILE, [_model_to_dict(a) for a in achievements])
    return achievement

def get_achievement_by_id(achievement_id: int) -> Achievement | None:
    """Get an achievement by ID"""
    achievements = get_achievements()
    for achievement in achievements:
        if achievement.id == achievement_id:
            return achievement
    return None

def update_achievement(achievement_id: int, achievement_update: Achievement) -> Achievement | None:
    """Update an achievement"""
    achievements = get_achievements()
    for i, achievement in enumerate(achievements):
        if achievement.id == achievement_id:
            achievement_update.id = achievement_id
            achievement_update.created_at = achievement.created_at
            achievements[i] = achievement_update
            _save_json_file(ACHIEVEMENTS_FILE, [_model_to_dict(a) for a in achievements])
            return achievement_update
    return None