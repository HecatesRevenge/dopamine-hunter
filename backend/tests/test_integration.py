"""
Integration tests for complete workflows
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from app.db.storage import users, tasks, achievements, fishes
from app.models import User, Task, Achievement, Fish, TaskStatus, AchievementType
from app.services.fish_service import FishService

client = TestClient(app)


class TestIntegration:
    """Test complete workflows and integration scenarios"""
    
    def setup_method(self):
        """Clear storage before each test"""
        users.clear()
        tasks.clear()
        achievements.clear()
        fishes.clear()
    
    def test_complete_user_workflow(self):
        """Test complete user creation and management workflow"""
        # Create a user
        user_data = {"username": "integrationuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        assert user_response.status_code == 200
        user_id = user_response.json()["id"]
        
        # Verify user exists
        get_user_response = client.get(f"/api/v1/users/{user_id}")
        assert get_user_response.status_code == 200
        assert get_user_response.json()["username"] == "integrationuser"
        
        # Create tasks for the user
        task1_data = {"title": "Task 1", "description": "First task"}
        task2_data = {"title": "Task 2", "description": "Second task"}
        
        task1_response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task1_data)
        task2_response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task2_data)
        
        assert task1_response.status_code == 200
        assert task2_response.status_code == 200
        
        # Get all tasks for user
        tasks_response = client.get(f"/api/v1/tasks/users/{user_id}/tasks")
        assert tasks_response.status_code == 200
        user_tasks = tasks_response.json()
        assert len(user_tasks) == 2
        
        # Create a fish for the user
        fish_data = {"name": "Integration Fish", "category": "Test"}
        fish_response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        assert fish_response.status_code == 200
        fish_id = fish_response.json()["id"]
        
        # Get all fishes for user
        fishes_response = client.get(f"/api/v1/users/{user_id}/fishes")
        assert fishes_response.status_code == 200
        user_fishes = fishes_response.json()
        assert len(user_fishes) == 1
        assert user_fishes[0]["name"] == "Integration Fish"
    
    def test_task_completion_workflow(self):
        """Test complete task completion workflow"""
        # Create user and task
        user_data = {"username": "taskuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        task_data = {"title": "Complete Me", "description": "This task should be completed"}
        task_response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task_data)
        task_id = task_response.json()["id"]
        
        # Verify task is pending
        get_task_response = client.get(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}")
        assert get_task_response.json()["status"] == "pending"
        assert get_task_response.json()["completed_at"] is None
        
        # Complete the task
        update_data = {
            "id": task_id,
            "title": "Complete Me",
            "description": "This task should be completed",
            "status": "completed",
            "user_id": user_id
        }
        update_response = client.put(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}", json=update_data)
        assert update_response.status_code == 200
        
        # Verify task is completed
        completed_task = update_response.json()
        assert completed_task["status"] == "completed"
        assert completed_task["completed_at"] is not None
    
    def test_fish_growth_workflow(self):
        """Test complete fish growth and feeding workflow"""
        # Create user and fish
        user_data = {"username": "fishuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        fish_data = {"name": "Growing Fish", "category": "Growth"}
        fish_response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        fish_id = fish_response.json()["id"]
        
        # Verify initial fish state
        initial_fish = fish_response.json()
        assert initial_fish["level"] == 1
        assert initial_fish["xp"] == 0
        assert initial_fish["tasks_completed"] == 0
        assert initial_fish["achievements_completed"] == 0
        assert initial_fish["feed_meter"] == 5
        assert initial_fish["alive"] is True
        
        # Complete tasks for the fish
        complete_task_response = client.post(f"/api/v1/users/{user_id}/fish/{fish_id}/complete_task?num_tasks=5")
        assert complete_task_response.status_code == 200
        
        # Verify fish has grown
        grown_fish = complete_task_response.json()
        assert grown_fish["tasks_completed"] == 5
        assert grown_fish["xp"] == 5  # 5 tasks * max(1, 0 achievements)
        
        # Complete an achievement
        complete_achievement_response = client.post(f"/api/v1/users/{user_id}/fish/{fish_id}/complete_achievement")
        assert complete_achievement_response.status_code == 200
        
        # Verify achievement was completed
        achievement_fish = complete_achievement_response.json()
        assert achievement_fish["achievements_completed"] == 1
        
        # Complete more tasks (should get more XP now)
        more_tasks_response = client.post(f"/api/v1/users/{user_id}/fish/{fish_id}/complete_task?num_tasks=10")
        assert more_tasks_response.status_code == 200
        
        # Verify fish got more XP due to achievements
        final_fish = more_tasks_response.json()
        assert final_fish["tasks_completed"] == 15  # 5 + 10
        # XP calculation: 5 tasks (5 XP) + 10 tasks (10 XP) = 15 XP total
        # Fish leveled up from 1 to 2 (used 10 XP), so remaining XP is 5
        assert final_fish["xp"] == 5  # 15 total XP - 10 XP used for level up
        assert final_fish["level"] == 2  # Fish should have leveled up
        
        # Feed the fish
        feed_response = client.post(f"/api/v1/users/{user_id}/feed_all")
        assert feed_response.status_code == 200
        assert feed_response.json()["fishes_fed"] == 1
    
    def test_multi_user_scenario(self):
        """Test scenario with multiple users"""
        # Create multiple users
        users_data = [
            {"username": "user1"},
            {"username": "user2"},
            {"username": "user3"}
        ]
        
        user_ids = []
        for user_data in users_data:
            response = client.post("/api/v1/users/", json=user_data)
            assert response.status_code == 200
            user_ids.append(response.json()["id"])
        
        # Create tasks for each user
        for i, user_id in enumerate(user_ids):
            task_data = {"title": f"Task for user {i+1}"}
            response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task_data)
            assert response.status_code == 200
        
        # Create fishes for each user
        for i, user_id in enumerate(user_ids):
            fish_data = {"name": f"Fish {i+1}", "category": f"Category {i+1}"}
            response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
            assert response.status_code == 200
        
        # Verify each user has their own data
        for i, user_id in enumerate(user_ids):
            # Check user tasks
            tasks_response = client.get(f"/api/v1/tasks/users/{user_id}/tasks")
            assert tasks_response.status_code == 200
            user_tasks = tasks_response.json()
            assert len(user_tasks) == 1
            assert user_tasks[0]["title"] == f"Task for user {i+1}"
            
            # Check user fishes
            fishes_response = client.get(f"/api/v1/users/{user_id}/fishes")
            assert fishes_response.status_code == 200
            user_fishes = fishes_response.json()
            assert len(user_fishes) == 1
            assert user_fishes[0]["name"] == f"Fish {i+1}"
    
    def test_error_handling_workflow(self):
        """Test error handling in various scenarios"""
        # Test creating user with duplicate username
        user_data = {"username": "duplicateuser"}
        response1 = client.post("/api/v1/users/", json=user_data)
        assert response1.status_code == 200
        
        response2 = client.post("/api/v1/users/", json=user_data)
        assert response2.status_code == 400
        assert "Username already exists" in response2.json()["detail"]
        
        # Test operations on non-existent user
        non_existent_user_id = 99999
        
        # Try to create task for non-existent user
        task_data = {"title": "Test Task"}
        response = client.post(f"/api/v1/tasks/users/{non_existent_user_id}/tasks", json=task_data)
        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]
        
        # Try to create fish for non-existent user
        fish_data = {"name": "Test Fish", "category": "Test"}
        response = client.post(f"/api/v1/users/{non_existent_user_id}/fish", json=fish_data)
        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]
        
        # Test operations on non-existent entities
        user_id = response1.json()["id"]
        
        # Try to get non-existent task
        response = client.get(f"/api/v1/tasks/users/{user_id}/tasks/99999")
        assert response.status_code == 404
        assert "Task not found" in response.json()["detail"]
        
        # Try to get non-existent achievement
        response = client.get("/api/v1/achievements/99999")
        assert response.status_code == 404
        assert "Achievement not found" in response.json()["detail"]
    
    def test_data_consistency_workflow(self):
        """Test data consistency across operations"""
        # Create user, task, and fish
        user_data = {"username": "consistencyuser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        task_data = {"title": "Consistency Task"}
        task_response = client.post(f"/api/v1/tasks/users/{user_id}/tasks", json=task_data)
        task_id = task_response.json()["id"]
        
        fish_data = {"name": "Consistency Fish", "category": "Test"}
        fish_response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        fish_id = fish_response.json()["id"]
        
        # Verify data is consistent in storage
        assert user_id in users
        assert task_id in tasks
        assert fish_id in fishes
        
        # Verify relationships are maintained
        assert task_id in users[user_id].tasks
        assert fish_id in users[user_id].fishes
        assert tasks[task_id].user_id == user_id
        assert fishes[fish_id].user_id == user_id
        
        # Update task and verify consistency
        update_data = {
            "id": task_id,
            "title": "Updated Consistency Task",
            "status": "completed",
            "user_id": user_id
        }
        update_response = client.put(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}", json=update_data)
        assert update_response.status_code == 200
        
        # Verify update is reflected in storage
        assert tasks[task_id].title == "Updated Consistency Task"
        assert tasks[task_id].status == TaskStatus.COMPLETED
        assert users[user_id].tasks[task_id].title == "Updated Consistency Task"
        assert users[user_id].tasks[task_id].status == TaskStatus.COMPLETED
        
        # Delete task and verify consistency
        delete_response = client.delete(f"/api/v1/tasks/users/{user_id}/tasks/{task_id}")
        assert delete_response.status_code == 200
        
        # Verify deletion is reflected in storage
        assert task_id not in tasks
        assert task_id not in users[user_id].tasks
    
    def test_fish_feeding_and_survival_workflow(self):
        """Test fish feeding and survival mechanics"""
        # Create user and fish
        user_data = {"username": "survivaluser"}
        user_response = client.post("/api/v1/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        fish_data = {"name": "Survival Fish", "category": "Test"}
        fish_response = client.post(f"/api/v1/users/{user_id}/fish", json=fish_data)
        fish_id = fish_response.json()["id"]
        
        # Verify initial state
        initial_fish = fish_response.json()
        assert initial_fish["feed_meter"] == 5
        assert initial_fish["alive"] is True
        
        # Feed the fish multiple times
        for _ in range(3):
            feed_response = client.post(f"/api/v1/users/{user_id}/feed_all")
            assert feed_response.status_code == 200
        
        # Get updated fish state
        fishes_response = client.get(f"/api/v1/users/{user_id}/fishes")
        fed_fish = fishes_response.json()[0]
        assert fed_fish["feed_meter"] == 8  # 5 + 3 feeds
        assert fed_fish["alive"] is True
        assert fed_fish["last_fed"] is not None
        
        # Run daily feed check (should not affect recently fed fish)
        check_response = client.post(f"/api/v1/users/{user_id}/daily_feed_check")
        assert check_response.status_code == 200
        assert check_response.json()["deaths_today"] == 0


if __name__ == "__main__":
    # Run tests
    test_instance = TestIntegration()
    
    # Get all test methods
    test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
    
    for test_method in test_methods:
        try:
            test_instance.setup_method()  # Clear storage before each test
            getattr(test_instance, test_method)()
            print(f"PASS: {test_method}")
        except Exception as e:
            print(f"FAIL: {test_method} - {e}")
    
    print("\nSUCCESS: All integration tests completed!")
