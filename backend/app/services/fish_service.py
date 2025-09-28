from datetime import datetime
from ..models import Fish

class FishService:
    """Service class for fish-related business logic"""
    
    @staticmethod
    def complete_task(fish: Fish, num_tasks: int = 1) -> Fish:
        """Complete tasks for a fish and update XP/level"""
        fish.tasks_completed += num_tasks
        xp_gain = num_tasks * max(1, fish.achievements_completed)
        FishService.add_xp(fish, xp_gain)
        return fish

    @staticmethod
    def complete_achievement(fish: Fish) -> Fish:
        """Complete an achievement for a fish"""
        fish.achievements_completed += 1
        return fish

    @staticmethod
    def add_xp(fish: Fish, xp: int) -> Fish:
        """Add XP to a fish and check for level up"""
        fish.xp += xp
        FishService.check_level_up(fish)
        return fish

    @staticmethod
    def check_level_up(fish: Fish) -> Fish:
        """Check if fish should level up based on XP"""
        while fish.xp >= fish.level * 10:  # Example XP per level
            fish.xp -= fish.level * 10
            fish.level += 1
        return fish

    @staticmethod
    def feed(fish: Fish) -> str:
        """Feed a fish and update feed meter"""
        if not fish.alive:
            return "This fish is dead."
        fish.feed_meter += 1
        fish.last_fed = datetime.now()
        return "Fish fed successfully"

    @staticmethod
    def daily_feed_check(fish: Fish) -> Fish:
        """Perform daily feed check and update fish status"""
        if not fish.alive:
            return fish
        
        if fish.last_fed:
            # If the fish hasn't been fed today, decrease feed meter
            if datetime.now().date() > fish.last_fed.date():
                fish.feed_meter -= 2
        
        if fish.feed_meter <= 0:
            fish.alive = False  # fish dies
        
        return fish
