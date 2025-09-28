from datetime import datetime

class Fish:
    def __init__(self, name: str, category: str):
        self.name = name
        self.category = category
        self.level = 1
        self.xp = 0
        self.achievements_completed = 0
        self.tasks_completed = 0

    def complete_task(self, num_tasks: int = 1):
        self.tasks_completed += num_tasks
        xp_gain = num_tasks * max(1, self.achievements_completed)
        self.add_xp(xp_gain)

    def complete_achievement(self):
        self.achievements_completed += 1

    def add_xp(self, xp: int):
        self.xp += xp
        self.check_level_up()

    def check_level_up(self):
        while self.xp >= self.level * 10:  # Example: 10 XP per level
            self.xp -= self.level * 10
            self.level += 1
