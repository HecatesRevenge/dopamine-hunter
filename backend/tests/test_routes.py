"""
Test API routes functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from app.db.storage import users, tasks, achievements, fishes
from app.models import User, Task, Achievement, Fish, TaskStatus, AchievementType
from app.services.id_service import id_service

client = TestClient(app)


class TestRoutes:
    """Test API routes functionality"""
    
    def setup_method(self):
        """Clear storage before each test"""
        users.clear()
        tasks.clear()
        achievements.clear()
        fishes.clear()
    
    def test_health_endpoint(self):
        """Test health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "Dopamine Hunter API is running" in data["message"]
    
    def test_create_user(self):
        """Test creating a new user"""
        user_data = {"username": "testuser"}
        response = client.post("/api/v1/users/", json=user_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["id"] is not None
        assert data["created_at"] is not None
    
    def test_create_duplicate_user(self):
        """Test creating a user with duplicate username"""
        # Create first user
        user_data = {"username": "duplicateuser"}
        response1 = client.post("/api/v1/users/", json=user_data)
        assert response1.status_code == 200
        
        # Try to create duplicate
        response2 = client.post("/api/v1/users/", json=user_data)
        assert response2.status_code == 400
        assert "Username already exists" in response2.json()["detail"]
    
    def test_get_users(self):
        """Test getting all users"""
        # Create some users
        user1_data = {"username": "user1"}
        user2_data = {"username": "user2"}
        
        client.post("/api/v1/users/", json=user1_data)
        client.post("/api/v1/users/", json=user2_data)
        
        response = client.get("/api/v1/users/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        usernames = [user["username"] for user in data]
        assert "user1" in usernames
        assert "user2" in usernames
    
    def test_get_user_by_id(self):
        """Test getting a user by ID"""
        # Create a user
        user_data = {"username": "testuser"}
        create_response = client.post("/api/v1/users/", json=user_data)
        user_id = create_response.json()["id"]
        
        # Get user by ID
        response = client.get(f"/api/v1/users/{user_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["id"] == user_id
    
    def test_get_nonexistent_user(self):
        """Test getting a user that doesn't exist"""
        response = client.get("/api/v1/users/99999")
        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]
    
    def test_create_task(self):
        """Test creating a new task"""
        # Create a user first
        user_data = {"username": "taskuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create a task
        task_data = {
            "title": "Test Task",
            "description": "Test description",
            "status": "pending"
        }
        response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["description"] == "Test description"
        assert data["status"] == "pending"
        assert data["user_id"] == user_id
        assert data["id"] is not None
        assert data["created_at"] is not None
    
    def test_get_tasks_for_user(self):
        """Test getting tasks for a specific user"""
        # Create a user and tasks
        user_data = {"username": "taskuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create tasks
        task1_data = {"title": "Task 1"}
        task2_data = {"title": "Task 2"}
        
        client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task1_data)
        client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task2_data)
        
        # Get tasks for user
        response = client.get(f"/api/v1/tasks/users/{user_id}/tasks")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all(task["user_id"] == user_id for task in data)
    
    def test_get_task_by_id(self):
        """Test getting a specific task by ID"""
        # Create a user and task
        user_data = {"username": "taskuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        task_data = {"title": "Test Task"}
        create_response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task_data)
        task_id = create_response.json()["id"]
        
        # Get task by ID
        response = client.get(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["id"] == task_id
    
    def test_update_task(self):
        """Test updating a task"""
        # Create a user and task
        user_data = {"username": "taskuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        task_data = {"title": "Original Task"}
        create_response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task_data)
        task_id = create_response.json()["id"]
        
        # Update task
        update_data = {
            "id": task_id,
            "title": "Updated Task",
            "description": "Updated description",
            "status": "completed",
            "user_id": user_id
        }
        response = client.put(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Task"
        assert data["description"] == "Updated description"
        assert data["status"] == "completed"
        assert data["completed_at"] is not None
    
    def test_delete_task(self):
        """Test deleting a task"""
        # Create a user and task
        user_data = {"username": "taskuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        task_data = {"title": "Task to Delete"}
        create_response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task_data)
        task_id = create_response.json()["id"]
        
        # Delete task
        response = client.delete(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}")
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]
        
        # Verify task is gone
        get_response = client.get(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}")
        assert get_response.status_code == 404
    
    def test_get_achievements(self):
        """Test getting all achievements"""
        response = client.get("/api/v1/achievements/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_achievements_by_user(self):
        """Test getting achievements filtered by user"""
        # Create a user
        user_data = {"username": "achievementuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Get achievements for user (should be empty initially)
        response = client.get(f"/api/v1/achievements/?user_id={user_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_achievement_by_id(self):
        """Test getting a specific achievement by ID"""
        # Try to get non-existent achievement
        response = client.get("/api/v1/achievements/99999")
        assert response.status_code == 404
        assert "Achievement not found" in response.json()["detail"]
    
    def test_create_fish(self):
        """Test creating a new fish"""
        # Create a user first
        user_data = {"username": "fishuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create a fish
        fish_data = {
            "name": "Goldie",
            "category": "Goldfish"
        }
        response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Goldie"
        assert data["category"] == "Goldfish"
        assert data["user_id"] == user_id
        assert data["id"] is not None
        assert data["level"] == 1
        assert data["xp"] == 0
        assert data["alive"] is True
    
    def test_get_user_fishes(self):
        """Test getting all fishes for a user"""
        # Create a user
        user_data = {"username": "fishuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create some fishes
        fish1_data = {"name": "Fish1", "category": "Category1"}
        fish2_data = {"name": "Fish2", "category": "Category2"}
        
        client.post(f"/api/v1/users/{user_id}/fish", json=fish1_data)
        client.post(f"/api/v1/users/{user_id}/fish", json=fish2_data)
        
        # Get fishes for user
        response = client.get(f"/api/v1/users/{user_id}/fishes")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all(fish["user_id"] == user_id for fish in data)
    
    def test_fish_complete_task(self):
        """Test fish completing tasks"""
        # Create a user and fish
        user_data = {"username": "fishuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        fish_data = {"name": "Test Fish", "category": "Test"}
        fish_response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        fish_id = fish_response.json()["id"]
        
        # Complete tasks for fish
        response = client.post(f"/api/v1/users/{user_id}/fish/{fish_id}/complete_task?num_tasks=3")
        assert response.status_code == 200
        data = response.json()
        assert data["tasks_completed"] == 3
        assert data["xp"] == 3  # 3 tasks * max(1, 0 achievements)
    
    def test_fish_complete_achievement(self):
        """Test fish completing an achievement"""
        # Create a user and fish
        user_data = {"username": "fishuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        fish_data = {"name": "Test Fish", "category": "Test"}
        fish_response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        fish_id = fish_response.json()["id"]
        
        # Complete achievement for fish
        response = client.post(f"/api/v1/users/{user_id}/fish/{fish_id}/complete_achievement")
        assert response.status_code == 200
        data = response.json()
        assert data["achievements_completed"] == 1
    
    def test_feed_all_fish(self):
        """Test feeding all fishes for a user"""
        # Create a user and fishes
        user_data = {"username": "fishuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        fish1_data = {"name": "Fish1", "category": "Category1"}
        fish2_data = {"name": "Fish2", "category": "Category2"}
        
        client.post(f"/api/v1/users/{user_id}/fish", json=fish1_data)
        client.post(f"/api/v1/users/{user_id}/fish", json=fish2_data)
        
        # Feed all fishes
        response = client.post(f"/api/v1/users/{user_id}/feed_all")
        assert response.status_code == 200
        data = response.json()
        assert "All fishes fed!" in data["message"]
        assert data["fishes_fed"] == 2
        assert data["fed_today"] is True
    
    def test_daily_feed_check(self):
        """Test daily feed check for all fishes"""
        # Create a user and fish
        user_data = {"username": "fishuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        fish_data = {"name": "Test Fish", "category": "Test"}
        client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        
        # Run daily feed check
        response = client.post(f"/api/v1/users/{user_id}/daily_feed_check")
        assert response.status_code == 200
        data = response.json()
        assert "deaths_today" in data
        assert data["deaths_today"] == 0  # Fish should still be alive
    
    def test_invalid_user_operations(self):
        """Test operations with invalid user IDs"""
        # Try to create task for non-existent user
        task_data = {"title": "Test Task"}
        response = client.post("/api/v1/tasks/users/99999/tasks", json=task_data)
        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]
        
        # Try to create fish for non-existent user
        fish_data = {"name": "Test Fish", "category": "Test"}
        response = client.post("/api/v1/users/99999/fish", json=fish_data)
        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]
    
    def test_invalid_task_operations(self):
        """Test operations with invalid task IDs"""
        # Create a user first
        user_data = {"username": "testuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Try to get non-existent task
        response = client.get(f"/api/v1/tasks/users/{user_id}/tasks/99999")
        assert response.status_code == 404
        assert "Task not found" in response.json()["detail"]
        
        # Try to update non-existent task
        update_data = {
            "id": 99999,
            "title": "Updated Task",
            "user_id": user_id
        }
        response = client.put(f"/api/v1/tasks/users/{user_id}/tasks/99999", json=update_data)
        assert response.status_code == 404
        assert "Task not found" in response.json()["detail"]
        
        # Try to delete non-existent task
        response = client.delete(f"/api/v1/tasks/users/{user_id}/tasks/99999")
        assert response.status_code == 404
        assert "Task not found" in response.json()["detail"]
    
    def test_invalid_fish_operations(self):
        """Test operations with invalid fish IDs"""
        # Create a user first
        user_data = {"username": "testuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Try to complete task for non-existent fish
        response = client.post(f"/api/v1/users/{user_id}/fish/99999/complete_task")
        assert response.status_code == 404
        assert "Fish not found" in response.json()["detail"]
        
        # Try to complete achievement for non-existent fish
        response = client.post(f"/api/v1/users/{user_id}/fish/99999/complete_achievement")
        assert response.status_code == 404
        assert "Fish not found" in response.json()["detail"]


if __name__ == "__main__":
    # Run tests
    test_instance = TestRoutes()
    
    # Get all test methods
    test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
    
    for test_method in test_methods:
        try:
            test_instance.setup_method()  # Clear storage before each test
            getattr(test_instance, test_method)()
            print(f"PASS: {test_method}")
        except Exception as e:
            print(f"FAIL: {test_method} - {e}")
    
    print("\nSUCCESS: All route tests completed!")
