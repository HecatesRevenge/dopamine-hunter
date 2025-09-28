"""
Test achievement endpoints
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_achievement():
    """Test creating a new achievement"""
    # First create a user to associate the achievement with
    user_data = {"username": "achievementuser"}
    user_response = client.post("/users", json=user_data)
    user_id = user_response.json()["id"]
    
    achievement_data = {
        "title": "Test Achievement",
        "description": "A test achievement description",
        "achievement_type": "custom",
        "user_id": user_id
    }
    
    response = client.post("/achievements", json=achievement_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Achievement"
    assert data["description"] == "A test achievement description"
    assert data["achievement_type"] == "custom"
    assert data["is_completed"] == False
    assert data["user_id"] == user_id
    assert data["id"] is not None
    assert data["created_at"] is not None

def test_create_streak_achievement():
    """Test creating a streak achievement"""
    user_data = {"username": "streakuser"}
    user_response = client.post("/users", json=user_data)
    user_id = user_response.json()["id"]
    
    achievement_data = {
        "title": "7 Day Streak",
        "description": "Complete tasks for 7 days in a row",
        "achievement_type": "streak",
        "streak_required": 7,
        "current_streak": 0,
        "user_id": user_id
    }
    
    response = client.post("/achievements", json=achievement_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["achievement_type"] == "streak"
    assert data["streak_required"] == 7
    assert data["current_streak"] == 0

def test_get_achievements():
    """Test getting all achievements"""
    response = client.get("/achievements")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Should have at least one achievement from the create tests
    assert len(data) >= 1

def test_get_achievements_by_user():
    """Test getting achievements filtered by user_id"""
    # Create a user and achievement
    user_data = {"username": "filterachievementuser"}
    user_response = client.post("/users", json=user_data)
    user_id = user_response.json()["id"]
    
    achievement_data = {
        "title": "Filtered Achievement",
        "description": "Test filtered achievement",
        "achievement_type": "custom",
        "user_id": user_id
    }
    client.post("/achievements", json=achievement_data)
    
    # Get achievements for this user
    response = client.get(f"/achievements?user_id={user_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # All achievements should belong to the specified user
    for achievement in data:
        assert achievement["user_id"] == user_id

def test_update_achievement():
    """Test updating an achievement"""
    # Create a user and achievement
    user_data = {"username": "updateachievementuser"}
    user_response = client.post("/users", json=user_data)
    user_id = user_response.json()["id"]
    
    achievement_data = {
        "title": "Original Achievement",
        "description": "Original description",
        "achievement_type": "custom",
        "user_id": user_id
    }
    create_response = client.post("/achievements", json=achievement_data)
    achievement_id = create_response.json()["id"]
    
    # Update the achievement
    update_data = {
        "title": "Updated Achievement",
        "description": "Updated description",
        "achievement_type": "custom",
        "is_completed": True,
        "user_id": user_id
    }
    
    response = client.put(f"/achievements/{achievement_id}", json=update_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Achievement"
    assert data["description"] == "Updated description"
    assert data["is_completed"] == True
    assert data["completed_at"] is not None

if __name__ == "__main__":
    test_create_achievement()
    print("PASS: Create achievement test passed!")
    
    test_create_streak_achievement()
    print("PASS: Create streak achievement test passed!")
    
    test_get_achievements()
    print("PASS: Get achievements test passed!")
    
    test_get_achievements_by_user()
    print("PASS: Get achievements by user test passed!")
    
    test_update_achievement()
    print("PASS: Update achievement test passed!")
    
    print("SUCCESS: All achievement tests passed!")
