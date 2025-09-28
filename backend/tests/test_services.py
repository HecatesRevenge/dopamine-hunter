"""
Test service layer functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
from app.models import Fish
from app.services.fish_service import FishService
from app.services.id_service import IDService


class TestFishService:
    """Test FishService business logic"""
    
    def test_complete_task(self):
        """Test completing tasks for a fish"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            level=1,
            xp=0,
            achievements_completed=0,
            tasks_completed=0
        )
        
        # Complete 1 task
        FishService.complete_task(fish, 1)
        assert fish.tasks_completed == 1
        assert fish.xp == 1  # 1 task * max(1, 0 achievements) = 1 XP
        
        # Complete 3 more tasks
        FishService.complete_task(fish, 3)
        assert fish.tasks_completed == 4
        assert fish.xp == 4  # 3 tasks * max(1, 0 achievements) = 3 more XP
    
    def test_complete_task_with_achievements(self):
        """Test completing tasks with achievements completed"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            level=1,
            xp=0,
            achievements_completed=2,
            tasks_completed=0
        )
        
        # Complete 2 tasks with 2 achievements
        FishService.complete_task(fish, 2)
        assert fish.tasks_completed == 2
        assert fish.xp == 4  # 2 tasks * max(1, 2 achievements) = 4 XP
    
    def test_complete_achievement(self):
        """Test completing an achievement"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            achievements_completed=0
        )
        
        FishService.complete_achievement(fish)
        assert fish.achievements_completed == 1
    
    def test_add_xp(self):
        """Test adding XP to a fish"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            level=1,
            xp=0
        )
        
        FishService.add_xp(fish, 5)  # Add 5 XP, not enough for level up
        assert fish.xp == 5
        assert fish.level == 1  # Not enough for level up yet
    
    def test_check_level_up(self):
        """Test level up mechanics"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            level=1,
            xp=0
        )
        
        # Add enough XP for level 2 (1 * 10 = 10 XP)
        FishService.add_xp(fish, 10)
        assert fish.level == 2
        assert fish.xp == 0  # XP should be reset after level up
        
        # Add more XP for level 3 (2 * 10 = 20 XP)
        FishService.add_xp(fish, 20)
        assert fish.level == 3
        assert fish.xp == 0
        
        # Add partial XP
        FishService.add_xp(fish, 15)
        assert fish.level == 3
        assert fish.xp == 15  # Should have 15 XP towards level 4
    
    def test_feed_alive_fish(self):
        """Test feeding an alive fish"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            feed_meter=5,
            alive=True
        )
        
        result = FishService.feed(fish)
        assert result == "Fish fed successfully"
        assert fish.feed_meter == 6
        assert fish.last_fed is not None
        assert fish.alive is True
    
    def test_feed_dead_fish(self):
        """Test feeding a dead fish"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            feed_meter=0,
            alive=False
        )
        
        result = FishService.feed(fish)
        assert result == "This fish is dead."
        assert fish.feed_meter == 0  # Should not change
        assert fish.last_fed is None  # Should not change
    
    def test_daily_feed_check_fed_today(self):
        """Test daily feed check when fish was fed today"""
        today = datetime.now()
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            feed_meter=5,
            alive=True,
            last_fed=today
        )
        
        FishService.daily_feed_check(fish)
        assert fish.feed_meter == 5  # Should not change
        assert fish.alive is True
    
    def test_daily_feed_check_not_fed_today(self):
        """Test daily feed check when fish wasn't fed today"""
        yesterday = datetime.now() - timedelta(days=1)
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            feed_meter=5,
            alive=True,
            last_fed=yesterday
        )
        
        FishService.daily_feed_check(fish)
        assert fish.feed_meter == 3  # Should decrease by 2
        assert fish.alive is True
    
    def test_daily_feed_check_fish_dies(self):
        """Test daily feed check when fish dies from hunger"""
        yesterday = datetime.now() - timedelta(days=1)
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            feed_meter=1,
            alive=True,
            last_fed=yesterday
        )
        
        FishService.daily_feed_check(fish)
        assert fish.feed_meter == -1  # Should decrease by 2
        assert fish.alive is False  # Fish should die
    
    def test_daily_feed_check_dead_fish(self):
        """Test daily feed check on already dead fish"""
        fish = Fish(
            id=1,
            name="Test Fish",
            category="Test",
            user_id=1,
            feed_meter=0,
            alive=False
        )
        
        FishService.daily_feed_check(fish)
        assert fish.feed_meter == 0  # Should not change
        assert fish.alive is False  # Should remain dead


class TestIDService:
    """Test IDService functionality"""
    
    def test_id_service_instances(self):
        """Test that IDService instances work independently"""
        service1 = IDService()
        service2 = IDService()
        
        # Each instance should have its own counters
        id1 = service1.generate_user_id()
        id2 = service2.generate_user_id()
        
        # Both should start from 1
        assert id1 == 1
        assert id2 == 1
        
        # Each instance should maintain its own counter
        id3 = service1.generate_user_id()
        id4 = service2.generate_user_id()
        
        assert id3 == 2
        assert id4 == 2
    
    def test_generate_user_id(self):
        """Test user ID generation"""
        service = IDService()
        
        id1 = service.generate_user_id()
        id2 = service.generate_user_id()
        id3 = service.generate_user_id()
        
        assert id1 == 1
        assert id2 == 2
        assert id3 == 3
    
    def test_generate_task_id(self):
        """Test task ID generation"""
        service = IDService()
        
        id1 = service.generate_task_id()
        id2 = service.generate_task_id()
        id3 = service.generate_task_id()
        
        assert id1 == 1
        assert id2 == 2
        assert id3 == 3
    
    def test_generate_fish_id(self):
        """Test fish ID generation"""
        service = IDService()
        
        id1 = service.generate_fish_id()
        id2 = service.generate_fish_id()
        id3 = service.generate_fish_id()
        
        assert id1 == 1
        assert id2 == 2
        assert id3 == 3
    
    def test_generate_achievement_id(self):
        """Test achievement ID generation"""
        service = IDService()
        
        id1 = service.generate_achievement_id()
        id2 = service.generate_achievement_id()
        id3 = service.generate_achievement_id()
        
        assert id1 == 1
        assert id2 == 2
        assert id3 == 3
    
    def test_id_generation_independence(self):
        """Test that different ID types are independent"""
        service = IDService()
        
        user_id = service.generate_user_id()
        task_id = service.generate_task_id()
        fish_id = service.generate_fish_id()
        achievement_id = service.generate_achievement_id()
        
        # All should start from 1
        assert user_id == 1
        assert task_id == 1
        assert fish_id == 1
        assert achievement_id == 1


if __name__ == "__main__":
    # Run tests
    test_classes = [TestFishService, TestIDService]
    
    for test_class in test_classes:
        print(f"\nTesting {test_class.__name__}...")
        test_instance = test_class()
        
        # Get all test methods
        test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
        
        for test_method in test_methods:
            try:
                getattr(test_instance, test_method)()
                print(f"  PASS: {test_method}")
            except Exception as e:
                print(f"  FAIL: {test_method} - {e}")
    
    print("\nSUCCESS: All service tests completed!")
