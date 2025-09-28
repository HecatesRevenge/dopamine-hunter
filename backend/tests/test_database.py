"""
Test database functions directly
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from app.models import User, Task, Achievement, TaskStatus, AchievementType
from app.db.database import (
    get_users, create_user, get_user_by_id,
    get_tasks, create_task, get_task_by_id, update_task, delete_task,
    get_achievements, create_achievement, get_achievement_by_id, update_achievement
)

def test_user_database_operations():
    """Test user database operations"""
    # Test creating a user
    user = User(username="dbtestuser", profile_pic="https://test.com/pic.jpg")
    created_user = create_user(user)
    
    assert created_user.id is not None
    assert created_user.username == "dbtestuser"
    assert created_user.created_at is not None
    
    # Test getting all users
    users = get_users()
    assert len(users) >= 1
    assert any(p.username == "dbtestuser" for p in users)
    
    # Test getting user by ID
    found_user = get_user_by_id(created_user.id)
    assert found_user is not None
    assert found_user.username == "dbtestuser"
    
    # Test getting non-existent user
    not_found = get_user_by_id(99999)
    assert not_found is None

def test_task_database_operations():
    """Test task database operations"""
    # Create a user first
    user = User(username="taskdbtestuser")
    created_user = create_user(user)
    
    # Test creating a task
    task = Task(
        title="Database Test Task",
        description="Testing database operations",
        user_id=created_user.id
    )
    created_task = create_task(task)
    
    assert created_task.id is not None
    assert created_task.title == "Database Test Task"
    assert created_task.status == TaskStatus.PENDING
    assert created_task.created_at is not None
    
    # Test getting all tasks
    tasks = get_tasks()
    assert len(tasks) >= 1
    assert any(t.title == "Database Test Task" for t in tasks)
    
    # Test getting tasks by user
    user_tasks = get_tasks(created_user.id)
    assert len(user_tasks) >= 1
    assert all(t.user_id == created_user.id for t in user_tasks)
    
    # Test getting task by ID
    found_task = get_task_by_id(created_task.id)
    assert found_task is not None
    assert found_task.title == "Database Test Task"
    
    # Test updating a task
    updated_task = Task(
        title="Updated Database Task",
        description="Updated description",
        status=TaskStatus.COMPLETED,
        user_id=created_user.id
    )
    result = update_task(created_task.id, updated_task)
    assert result is not None
    assert result.title == "Updated Database Task"
    assert result.status == TaskStatus.COMPLETED
    
    # Test deleting a task
    delete_result = delete_task(created_task.id)
    assert delete_result == True
    
    # Verify task is deleted
    deleted_task = get_task_by_id(created_task.id)
    assert deleted_task is None

def test_achievement_database_operations():
    """Test achievement database operations"""
    # Create a user first
    user = User(username="achievementdbtestuser")
    created_user = create_user(user)
    
    # Test creating an achievement
    achievement = Achievement(
        title="Database Test Achievement",
        description="Testing achievement database operations",
        achievement_type=AchievementType.CUSTOM,
        user_id=created_user.id
    )
    created_achievement = create_achievement(achievement)
    
    assert created_achievement.id is not None
    assert created_achievement.title == "Database Test Achievement"
    assert created_achievement.achievement_type == AchievementType.CUSTOM
    assert created_achievement.is_completed == False
    assert created_achievement.created_at is not None
    
    # Test getting all achievements
    achievements = get_achievements()
    assert len(achievements) >= 1
    assert any(a.title == "Database Test Achievement" for a in achievements)
    
    # Test getting achievements by user
    user_achievements = get_achievements(created_user.id)
    assert len(user_achievements) >= 1
    assert all(a.user_id == created_user.id for a in user_achievements)
    
    # Test getting achievement by ID
    found_achievement = get_achievement_by_id(created_achievement.id)
    assert found_achievement is not None
    assert found_achievement.title == "Database Test Achievement"
    
    # Test updating an achievement
    updated_achievement = Achievement(
        title="Updated Database Achievement",
        description="Updated description",
        achievement_type=AchievementType.CUSTOM,
        is_completed=True,
        user_id=created_user.id
    )
    result = update_achievement(created_achievement.id, updated_achievement)
    assert result is not None
    assert result.title == "Updated Database Achievement"
    assert result.is_completed == True

if __name__ == "__main__":
    test_user_database_operations()
    print("PASS: User database operations test passed!")
    
    test_task_database_operations()
    print("PASS: Task database operations test passed!")
    
    test_achievement_database_operations()
    print("PASS: Achievement database operations test passed!")
    
    print("SUCCESS: All database tests passed!")
