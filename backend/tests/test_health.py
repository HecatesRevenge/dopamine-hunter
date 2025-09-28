"""
Test the health endpoint
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    """Test that the health endpoint returns the expected response"""
    response = client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Dopamine Hunter API is running" in data["message"]

if __name__ == "__main__":
    test_health_endpoint()
    print("PASS: Health endpoint test passed!")
