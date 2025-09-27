# backend makes database:
# profile
# achievements
# skill tree
from typing import Union, Optional
from fastapi import FastAPI
from datetime import datetime, timedelta
from pydantic import BaseModel

app = FastAPI()

class achievements:
    def __init__ (self, title: str, descripton: str, dateCompleted, dueDate: datetime = None):
        self.title = title
        self.descriptor = descripton
        # If no due_date is provided, default to 7 days from now
        self.due_date = due_date if due_date else datetime.now() + timedelta(days=7)
        self.date_completed = None # None until the achievement is completed

        def complete(self):
            self.date_completed = datetime.now()  # mark completion with current time

class StreakAchievement(achievements):
    def __init__(self, name: str, description: str, streak_required: int):
        super().__init__(name, description)
        self.streak_required = streak_required #may have to make this based on the current streak/week
        self.current_streak = 0
    
    def update_streak(self, did_task_today: bool):
        if did_task_today:
            self.current_streak += 1
            if self.current_streak >= self.streak_required:
                self.complete()
        else:
            self.current_streak = 0  # streak broken
    
    # Subclass for total tasks achievement
class TotalTasksAchievement(achievements):
    def __init__(self, name: str, description: str, total_required: int):
        super().__init__(name, description)
        self.total_required = total_required
        self.total_completed = 0

    def update_total(self, tasks_done_today: int):
        self.total_completed += tasks_done_today
        if self.total_completed >= self.total_required:
            self.complete()