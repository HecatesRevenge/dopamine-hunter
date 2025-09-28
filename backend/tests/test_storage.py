"""
Test storage layer functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.storage import users, achievements, tasks, fishes
from app.models import User, Task, Achievement, Fish, TaskStatus, AchievementType
from app.services.id_service import id_service


class TestStorage:
    """Test storage layer functionality"""
    
    def setup_method(self):
        """Clear storage before each test"""
        users.clear()
        achievements.clear()
        tasks.clear()
        fishes.clear()
    
    def test_user_storage(self):
        """Test user storage operations"""
        # Create a user
        user = User(id=id_service.generate_user_id(), username="testuser")
        users[user.id] = user
        
        # Verify storage
        assert len(users) == 1
        assert user.id in users
        assert users[user.id].username == "testuser"
        
        # Add another user
        user2 = User(id=id_service.generate_user_id(), username="testuser2")
        users[user2.id] = user2
        
        assert len(users) == 2
        assert user2.id in users
    
    def test_task_storage(self):
        """Test task storage operations"""
        # Create a user first
        user = User(id=id_service.generate_user_id(), username="testuser")
        users[user.id] = user
        
        # Create a task
        task = Task(
            id=id_service.generate_task_id(),
            title="Test Task",
            description="Test description",
            user_id=user.id
        )
        tasks[task.id] = task
        user.tasks[task.id] = task
        
        # Verify storage
        assert len(tasks) == 1
        assert task.id in tasks
        assert tasks[task.id].title == "Test Task"
        assert len(user.tasks) == 1
        assert task.id in user.tasks
    
    def test_achievement_storage(self):
        """Test achievement storage operations"""
        # Create a user first
        user = User(id=id_service.generate_user_id(), username="testuser")
        users[user.id] = user
        
        # Create an achievement
        achievement = Achievement(
            id=id_service.generate_achievement_id(),
            title="Test Achievement",
            description="Test description",
            achievement_type=AchievementType.CUSTOM,
            user_id=user.id
        )
        achievements[achievement.id] = achievement
        user.achievements[achievement.id] = achievement
        
        # Verify storage
        assert len(achievements) == 1
        assert achievement.id in achievements
        assert achievements[achievement.id].title == "Test Achievement"
        assert len(user.achievements) == 1
        assert achievement.id in user.achievements
    
    def test_fish_storage(self):
        """Test fish storage operations"""
        # Create a user first
        user = User(id=id_service.generate_user_id(), username="testuser")
        users[user.id] = user
        
        # Create a fish
        fish = Fish(
            id=id_service.generate_fish_id(),
            name="Test Fish",
            category="Test",
            user_id=user.id
        )
        fishes[fish.id] = fish
        user.fishes[fish.id] = fish
        
        # Verify storage
        assert len(fishes) == 1
        assert fish.id in fishes
        assert fishes[fish.id].name == "Test Fish"
        assert len(user.fishes) == 1
        assert fish.id in user.fishes
    
    def test_storage_relationships(self):
        """Test that storage maintains relationships correctly"""
        # Create a user
        user = User(id=id_service.generate_user_id(), username="testuser")
        users[user.id] = user
        
        # Create related entities
        task = Task(
            id=id_service.generate_task_id(),
            title="Test Task",
            user_id=user.id
        )
        tasks[task.id] = task
        user.tasks[task.id] = task
        
        achievement = Achievement(
            id=id_service.generate_achievement_id(),
            title="Test Achievement",
            description="Test",
            achievement_type=AchievementType.CUSTOM,
            user_id=user.id
        )
        achievements[achievement.id] = achievement
        user.achievements[achievement.id] = achievement
        
        fish = Fish(
            id=id_service.generate_fish_id(),
            name="Test Fish",
            category="Test",
            user_id=user.id
        )
        fishes[fish.id] = fish
        user.fishes[fish.id] = fish
        
        # Verify relationships
        assert len(user.tasks) == 1
        assert len(user.achievements) == 1
        assert len(user.fishes) == 1
        
        # Verify task belongs to user
        assert task.user_id == user.id
        assert task.id in user.tasks
        
        # Verify achievement belongs to user
        assert achievement.user_id == user.id
        assert achievement.id in user.achievements
        
        # Verify fish belongs to user
        assert fish.user_id == user.id
        assert fish.id in user.fishes
    
    def test_storage_deletion(self):
        """Test storage deletion operations"""
        # Create a user and task
        user = User(id=id_service.generate_user_id(), username="testuser")
        users[user.id] = user
        
        task = Task(
            id=id_service.generate_task_id(),
            title="Test Task",
            user_id=user.id
        )
        tasks[task.id] = task
        user.tasks[task.id] = task
        
        # Verify initial state
        assert len(tasks) == 1
        assert len(user.tasks) == 1
        
        # Delete task
        del tasks[task.id]
        del user.tasks[task.id]
        
        # Verify deletion
        assert len(tasks) == 0
        assert len(user.tasks) == 0
        assert task.id not in tasks
        assert task.id not in user.tasks
    
    def test_storage_update(self):
        """Test storage update operations"""
        # Create a user and task
        user = User(id=id_service.generate_user_id(), username="testuser")
        users[user.id] = user
        
        task = Task(
            id=id_service.generate_task_id(),
            title="Original Task",
            user_id=user.id
        )
        tasks[task.id] = task
        user.tasks[task.id] = task
        
        # Update task
        task.title = "Updated Task"
        task.status = TaskStatus.COMPLETED
        tasks[task.id] = task
        user.tasks[task.id] = task
        
        # Verify update
        assert tasks[task.id].title == "Updated Task"
        assert tasks[task.id].status == TaskStatus.COMPLETED
        assert user.tasks[task.id].title == "Updated Task"
        assert user.tasks[task.id].status == TaskStatus.COMPLETED
    
    def test_storage_isolation(self):
        """Test that different entity types are stored separately"""
        # Create entities of different types with unique IDs
        user = User(id=1, username="testuser")
        users[user.id] = user
        
        task = Task(
            id=2,
            title="Test Task",
            user_id=user.id
        )
        tasks[task.id] = task
        
        achievement = Achievement(
            id=3,
            title="Test Achievement",
            description="Test",
            achievement_type=AchievementType.CUSTOM,
            user_id=user.id
        )
        achievements[achievement.id] = achievement
        
        fish = Fish(
            id=4,
            name="Test Fish",
            category="Test",
            user_id=user.id
        )
        fishes[fish.id] = fish
        
        # Verify isolation
        assert len(users) == 1
        assert len(tasks) == 1
        assert len(achievements) == 1
        assert len(fishes) == 1
        
        # Verify no cross-contamination
        assert task.id not in users
        assert achievement.id not in tasks
        assert fish.id not in achievements
        assert user.id not in tasks


if __name__ == "__main__":
    # Run tests
    test_instance = TestStorage()
    
    # Get all test methods
    test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
    
    for test_method in test_methods:
        try:
            test_instance.setup_method()  # Clear storage before each test
            getattr(test_instance, test_method)()
            print(f"PASS: {test_method}")
        except Exception as e:
            print(f"FAIL: {test_method} - {e}")
    
    print("\nSUCCESS: All storage tests completed!")
