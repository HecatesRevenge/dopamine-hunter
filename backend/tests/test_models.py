"""
Test Pydantic models and validation
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from pydantic import ValidationError

from app.models import (
    TaskCreate, Task, TaskStatus,
    UserCreate, User,
    FishCreate, Fish,
    Achievement, AchievementType
)


class TestTaskCreate:
    """Test TaskCreate model validation"""
    
    def test_valid_task_create(self):
        """Test creating a valid task"""
        task = TaskCreate(
            title="Test Task",
            description="Test description",
            status=TaskStatus.PENDING
        )
        assert task.title == "Test Task"
        assert task.description == "Test description"
        assert task.status == TaskStatus.PENDING
    
    def test_task_create_with_none_description(self):
        """Test creating a task with None description"""
        task = TaskCreate(title="Test Task")
        assert task.title == "Test Task"
        assert task.description is None
        assert task.status == TaskStatus.PENDING
    
    def test_task_create_default_status(self):
        """Test that status defaults to PENDING"""
        task = TaskCreate(title="Test Task")
        assert task.status == TaskStatus.PENDING


class TestTask:
    """Test Task model"""
    
    def test_valid_task(self):
        """Test creating a valid task"""
        task = Task(
            id=1,
            title="Test Task",
            description="Test description",
            status=TaskStatus.PENDING,
            user_id=1
        )
        assert task.id == 1
        assert task.title == "Test Task"
        assert task.description == "Test description"
        assert task.status == TaskStatus.PENDING
        assert task.user_id == 1
        assert task.created_at is not None
        assert task.completed_at is None
    
    def test_task_with_completion(self):
        """Test task with completion date"""
        completed_at = datetime.now()
        task = Task(
            id=1,
            title="Completed Task",
            user_id=1,
            status=TaskStatus.COMPLETED,
            completed_at=completed_at
        )
        assert task.status == TaskStatus.COMPLETED
        assert task.completed_at == completed_at


class TestUserCreate:
    """Test UserCreate model validation"""
    
    def test_valid_user_create(self):
        """Test creating a valid user"""
        user = UserCreate(username="testuser")
        assert user.username == "testuser"
    
    def test_user_create_validation(self):
        """Test user creation validation"""
        # Valid usernames
        valid_usernames = ["user123", "test_user", "user-name", "User123"]
        for username in valid_usernames:
            user = UserCreate(username=username)
            assert user.username == username


class TestUser:
    """Test User model"""
    
    def test_valid_user(self):
        """Test creating a valid user"""
        user = User(
            id=1,
            username="testuser",
            profile_pic="https://example.com/pic.jpg"
        )
        assert user.id == 1
        assert user.username == "testuser"
        assert user.profile_pic == "https://example.com/pic.jpg"
        assert user.created_at is not None
        assert user.tasks == {}
        assert user.achievements == {}
        assert user.fishes == {}
    
    def test_user_with_defaults(self):
        """Test user with default values"""
        user = User(id=1, username="testuser")
        assert user.profile_pic is None
        assert user.tasks == {}
        assert user.achievements == {}
        assert user.fishes == {}


class TestFishCreate:
    """Test FishCreate model validation"""
    
    def test_valid_fish_create(self):
        """Test creating a valid fish"""
        fish = FishCreate(name="Goldie", category="Goldfish")
        assert fish.name == "Goldie"
        assert fish.category == "Goldfish"


class TestFish:
    """Test Fish model"""
    
    def test_valid_fish(self):
        """Test creating a valid fish"""
        fish = Fish(
            id=1,
            name="Goldie",
            category="Goldfish",
            user_id=1
        )
        assert fish.id == 1
        assert fish.name == "Goldie"
        assert fish.category == "Goldfish"
        assert fish.user_id == 1
        assert fish.level == 1
        assert fish.xp == 0
        assert fish.achievements_completed == 0
        assert fish.tasks_completed == 0
        assert fish.feed_meter == 5
        assert fish.alive is True
        assert fish.created_at is not None
        assert fish.last_fed is None
    
    def test_fish_with_custom_values(self):
        """Test fish with custom values"""
        fish = Fish(
            id=1,
            name="Bubbles",
            category="Betta",
            user_id=1,
            level=5,
            xp=100,
            achievements_completed=3,
            tasks_completed=10,
            feed_meter=8,
            alive=False
        )
        assert fish.level == 5
        assert fish.xp == 100
        assert fish.achievements_completed == 3
        assert fish.tasks_completed == 10
        assert fish.feed_meter == 8
        assert fish.alive is False


class TestAchievement:
    """Test Achievement model"""
    
    def test_valid_achievement(self):
        """Test creating a valid achievement"""
        achievement = Achievement(
            id=1,
            title="First Task",
            description="Complete your first task",
            achievement_type=AchievementType.CUSTOM,
            user_id=1
        )
        assert achievement.id == 1
        assert achievement.title == "First Task"
        assert achievement.description == "Complete your first task"
        assert achievement.achievement_type == AchievementType.CUSTOM
        assert achievement.is_completed is False
        assert achievement.user_id == 1
        assert achievement.created_at is None
        assert achievement.completed_at is None
    
    def test_streak_achievement(self):
        """Test streak achievement"""
        achievement = Achievement(
            id=1,
            title="7 Day Streak",
            description="Complete tasks for 7 days",
            achievement_type=AchievementType.STREAK,
            streak_required=7,
            current_streak=3,
            user_id=1
        )
        assert achievement.achievement_type == AchievementType.STREAK
        assert achievement.streak_required == 7
        assert achievement.current_streak == 3
    
    def test_total_tasks_achievement(self):
        """Test total tasks achievement"""
        achievement = Achievement(
            id=1,
            title="Task Master",
            description="Complete 100 tasks",
            achievement_type=AchievementType.TOTAL_TASKS,
            total_required=100,
            total_completed=25,
            user_id=1
        )
        assert achievement.achievement_type == AchievementType.TOTAL_TASKS
        assert achievement.total_required == 100
        assert achievement.total_completed == 25


class TestEnums:
    """Test enum values"""
    
    def test_task_status_enum(self):
        """Test TaskStatus enum values"""
        assert TaskStatus.PENDING == "pending"
        assert TaskStatus.COMPLETED == "completed"
        assert TaskStatus.CANCELLED == "cancelled"
    
    def test_achievement_type_enum(self):
        """Test AchievementType enum values"""
        assert AchievementType.STREAK == "streak"
        assert AchievementType.TOTAL_TASKS == "total_tasks"
        assert AchievementType.CUSTOM == "custom"


if __name__ == "__main__":
    # Run tests
    test_classes = [
        TestTaskCreate, TestTask, TestUserCreate, TestUser,
        TestFishCreate, TestFish, TestAchievement, TestEnums
    ]
    
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
    
    print("\nSUCCESS: All model tests completed!")
