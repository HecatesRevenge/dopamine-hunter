"""
Run all tests in sequence
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def run_all_tests():
    """Run all test modules"""
    print("STARTING: Dopamine Hunter Backend Tests")
    print("=" * 50)
    
    try:
        # Import and run each test module
        print("\nTesting Health Endpoint...")
        from test_health import test_health_endpoint
        test_health_endpoint()
        print("PASS: Health endpoint test passed!")
        
        print("\nTesting User Endpoints...")
        from test_users import (
            test_create_user, test_get_users, 
            test_get_user_by_id, test_get_nonexistent_user
        )
        test_create_user()
        test_get_users()
        test_get_user_by_id()
        test_get_nonexistent_user()
        print("PASS: All user tests passed!")
        
        print("\nTesting Task Endpoints...")
        from test_tasks import (
            test_create_task, test_get_tasks, test_get_tasks_by_user,
            test_update_task, test_delete_task
        )
        test_create_task()
        test_get_tasks()
        test_get_tasks_by_user()
        test_update_task()
        test_delete_task()
        print("PASS: All task tests passed!")
        
        print("\nTesting Achievement Endpoints...")
        from test_achievements import (
            test_create_achievement, test_create_streak_achievement,
            test_get_achievements, test_get_achievements_by_user,
            test_update_achievement
        )
        test_create_achievement()
        test_create_streak_achievement()
        test_get_achievements()
        test_get_achievements_by_user()
        test_update_achievement()
        print("PASS: All achievement tests passed!")
        
        print("\nTesting Database Functions...")
        from test_database import (
            test_user_database_operations,
            test_task_database_operations,
            test_achievement_database_operations
        )
        test_user_database_operations()
        test_task_database_operations()
        test_achievement_database_operations()
        print("PASS: All database tests passed!")
        
        print("\n" + "=" * 50)
        print("SUCCESS: ALL TESTS PASSED!")
        print("Your Dopamine Hunter backend is working correctly!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\nFAILED: Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
