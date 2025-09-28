"""
Test task endpoints
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_task():
    """Test creating a new task"""
    # First create a profile to associate the task with
    profile_data = {"username": "taskuser"}
    profile_response = client.post("/profiles", json=profile_data)
    profile_id = profile_response.json()["id"]
    
    task_data = {
        "title": "Test Task",
        "description": "A test task description",
        "profile_id": profile_id
    }
    
    response = client.post("/tasks", json=task_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "A test task description"
    assert data["status"] == "pending"
    assert data["profile_id"] == profile_id
    assert data["id"] is not None
    assert data["created_at"] is not None

def test_get_tasks():
    """Test getting all tasks"""
    response = client.get("/tasks")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Should have at least one task from the create test
    assert len(data) >= 1

def test_get_tasks_by_profile():
    """Test getting tasks filtered by profile_id"""
    # Create a profile and task
    profile_data = {"username": "filteruser"}
    profile_response = client.post("/profiles", json=profile_data)
    profile_id = profile_response.json()["id"]
    
    task_data = {
        "title": "Filtered Task",
        "profile_id": profile_id
    }
    client.post("/tasks", json=task_data)
    
    # Get tasks for this profile
    response = client.get(f"/tasks?profile_id={profile_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # All tasks should belong to the specified profile
    for task in data:
        assert task["profile_id"] == profile_id

def test_update_task():
    """Test updating a task"""
    # Create a profile and task
    profile_data = {"username": "updateuser"}
    profile_response = client.post("/profiles", json=profile_data)
    profile_id = profile_response.json()["id"]
    
    task_data = {
        "title": "Original Task",
        "profile_id": profile_id
    }
    create_response = client.post("/tasks", json=task_data)
    task_id = create_response.json()["id"]
    
    # Update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated description",
        "status": "completed",
        "profile_id": profile_id
    }
    
    response = client.put(f"/tasks/{task_id}", json=update_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["description"] == "Updated description"
    assert data["status"] == "completed"
    assert data["completed_at"] is not None

def test_delete_task():
    """Test deleting a task"""
    # Create a profile and task
    profile_data = {"username": "deleteuser"}
    profile_response = client.post("/profiles", json=profile_data)
    profile_id = profile_response.json()["id"]
    
    task_data = {
        "title": "Task to Delete",
        "profile_id": profile_id
    }
    create_response = client.post("/tasks", json=task_data)
    task_id = create_response.json()["id"]
    
    # Delete the task
    response = client.delete(f"/tasks/{task_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert "deleted successfully" in data["message"]
    
    # Verify the task is gone
    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404

if __name__ == "__main__":
    test_create_task()
    print("PASS: Create task test passed!")
    
    test_get_tasks()
    print("PASS: Get tasks test passed!")
    
    test_get_tasks_by_profile()
    print("PASS: Get tasks by profile test passed!")
    
    test_update_task()
    print("PASS: Update task test passed!")
    
    test_delete_task()
    print("PASS: Delete task test passed!")
    
    print("SUCCESS: All task tests passed!")
