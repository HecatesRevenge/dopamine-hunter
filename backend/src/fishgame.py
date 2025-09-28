from datetime import datetime, timedelta

class Fish:
    def __init__(self, name: str, category: str):
        self.name = name
        self.category = category
        self.level = 1
        self.xp = 0
        self.achievements_completed = 0
        self.tasks_completed = 0
        self.feed_meter = 5  # starting feed level
        self.last_fed: datetime = None
        self.alive = True

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
        while self.xp >= self.level * 10:  # Example XP per level
            self.xp -= self.level * 10
            self.level += 1

    def feed(self):
        if not self.alive:
            return "This fish is dead."
        self.feed_meter += 1
        self.last_fed = datetime.now()

    def daily_feed_check(self):
        if not self.alive:
            return
        if self.last_fed:
            # If the fish hasn't been fed today, decrease feed meter
            if datetime.now().date() > self.last_fed.date():
                self.feed_meter -= 2
        if self.feed_meter <= 0:
            self.alive = False  # fish dies
