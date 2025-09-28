"""
Test profile endpoints
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_profile():
    """Test creating a new profile"""
    profile_data = {
        "username": "testuser",
        "profile_pic": "https://example.com/pic.jpg"
    }
    
    response = client.post("/profiles", json=profile_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["profile_pic"] == "https://example.com/pic.jpg"
    assert data["id"] is not None
    assert data["created_at"] is not None

def test_get_profiles():
    """Test getting all profiles"""
    response = client.get("/profiles")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Should have at least one profile from the create test
    assert len(data) >= 1

def test_get_profile_by_id():
    """Test getting a specific profile by ID"""
    # First create a profile
    profile_data = {
        "username": "testuser2",
        "profile_pic": "https://example.com/pic2.jpg"
    }
    
    create_response = client.post("/profiles", json=profile_data)
    profile_id = create_response.json()["id"]
    
    # Then get it by ID
    response = client.get(f"/profiles/{profile_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser2"
    assert data["id"] == profile_id

def test_get_nonexistent_profile():
    """Test getting a profile that doesn't exist"""
    response = client.get("/profiles/99999")
    
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["detail"].lower()

if __name__ == "__main__":
    test_create_profile()
    print("PASS: Create profile test passed!")
    
    test_get_profiles()
    print("PASS: Get profiles test passed!")
    
    test_get_profile_by_id()
    print("PASS: Get profile by ID test passed!")
    
    test_get_nonexistent_profile()
    print("PASS: Get nonexistent profile test passed!")
    
    print("SUCCESS: All profile tests passed!")
