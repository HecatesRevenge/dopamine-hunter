"""
Test user endpoints
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_user():
    """Test creating a new user"""
    user_data = {
        "username": "testuser",
        "profile_pic": "https://example.com/pic.jpg"
    }
    
    response = client.post("/users", json=user_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["profile_pic"] == "https://example.com/pic.jpg"
    assert data["id"] is not None
    assert data["created_at"] is not None

def test_get_users():
    """Test getting all users"""
    response = client.get("/users")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Should have at least one user from the create test
    assert len(data) >= 1

def test_get_user_by_id():
    """Test getting a specific user by ID"""
    # First create a user
    user_data = {
        "username": "testuser2",
        "profile_pic": "https://example.com/pic2.jpg"
    }
    
    create_response = client.post("/users", json=user_data)
    user_id = create_response.json()["id"]
    
    # Then get it by ID
    response = client.get(f"/users/{user_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser2"
    assert data["id"] == user_id

def test_get_nonexistent_user():
    """Test getting a user that doesn't exist"""
    response = client.get("/users/99999")
    
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["detail"].lower()

if __name__ == "__main__":
    test_create_user()
    print("PASS: Create user test passed!")
    
    test_get_users()
    print("PASS: Get users test passed!")
    
    test_get_user_by_id()
    print("PASS: Get user by ID test passed!")
    
    test_get_nonexistent_user()
    print("PASS: Get nonexistent user test passed!")
    
    print("SUCCESS: All user tests passed!")
