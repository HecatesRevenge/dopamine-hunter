"""
Test database functions directly
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from app.models import Profile, Task, Achievement, TaskStatus, AchievementType
from app.db.database import (
    get_profiles, create_profile, get_profile_by_id,
    get_tasks, create_task, get_task_by_id, update_task, delete_task,
    get_achievements, create_achievement, get_achievement_by_id, update_achievement
)

def test_profile_database_operations():
    """Test profile database operations"""
    # Test creating a profile
    profile = Profile(username="dbtestuser", profile_pic="https://test.com/pic.jpg")
    created_profile = create_profile(profile)
    
    assert created_profile.id is not None
    assert created_profile.username == "dbtestuser"
    assert created_profile.created_at is not None
    
    # Test getting all profiles
    profiles = get_profiles()
    assert len(profiles) >= 1
    assert any(p.username == "dbtestuser" for p in profiles)
    
    # Test getting profile by ID
    found_profile = get_profile_by_id(created_profile.id)
    assert found_profile is not None
    assert found_profile.username == "dbtestuser"
    
    # Test getting non-existent profile
    not_found = get_profile_by_id(99999)
    assert not_found is None

def test_task_database_operations():
    """Test task database operations"""
    # Create a profile first
    profile = Profile(username="taskdbtestuser")
    created_profile = create_profile(profile)
    
    # Test creating a task
    task = Task(
        title="Database Test Task",
        description="Testing database operations",
        profile_id=created_profile.id
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
    
    # Test getting tasks by profile
    profile_tasks = get_tasks(created_profile.id)
    assert len(profile_tasks) >= 1
    assert all(t.profile_id == created_profile.id for t in profile_tasks)
    
    # Test getting task by ID
    found_task = get_task_by_id(created_task.id)
    assert found_task is not None
    assert found_task.title == "Database Test Task"
    
    # Test updating a task
    updated_task = Task(
        title="Updated Database Task",
        description="Updated description",
        status=TaskStatus.COMPLETED,
        profile_id=created_profile.id
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
    # Create a profile first
    profile = Profile(username="achievementdbtestuser")
    created_profile = create_profile(profile)
    
    # Test creating an achievement
    achievement = Achievement(
        title="Database Test Achievement",
        description="Testing achievement database operations",
        achievement_type=AchievementType.CUSTOM,
        profile_id=created_profile.id
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
    
    # Test getting achievements by profile
    profile_achievements = get_achievements(created_profile.id)
    assert len(profile_achievements) >= 1
    assert all(a.profile_id == created_profile.id for a in profile_achievements)
    
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
        profile_id=created_profile.id
    )
    result = update_achievement(created_achievement.id, updated_achievement)
    assert result is not None
    assert result.title == "Updated Database Achievement"
    assert result.is_completed == True

if __name__ == "__main__":
    test_profile_database_operations()
    print("PASS: Profile database operations test passed!")
    
    test_task_database_operations()
    print("PASS: Task database operations test passed!")
    
    test_achievement_database_operations()
    print("PASS: Achievement database operations test passed!")
    
    print("SUCCESS: All database tests passed!")
