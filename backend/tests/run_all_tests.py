"""
Run all new comprehensive tests for the Dopamine Hunter backend
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def run_all_tests():
    """Run all test modules"""
    print("STARTING: Dopamine Hunter Backend Comprehensive Tests")
    print("=" * 60)
    
    try:
        # Test Models
        print("\nTEST Testing Models and Validation...")
        from test_models import (
            TestTaskCreate, TestTask, TestUserCreate, TestUser,
            TestFishCreate, TestFish, TestAchievement, TestEnums
        )
        
        test_classes = [
            TestTaskCreate, TestTask, TestUserCreate, TestUser,
            TestFishCreate, TestFish, TestAchievement, TestEnums
        ]
        
        for test_class in test_classes:
            test_instance = test_class()
            test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
            
            for test_method in test_methods:
                try:
                    getattr(test_instance, test_method)()
                except Exception as e:
                    print(f"  FAIL: {test_class.__name__}.{test_method} - {e}")
                    return False
        
        print("  PASS All model tests passed!")
        
        # Test Services
        print("\nSERVICE Testing Service Layer...")
        from test_services import TestFishService, TestIDService
        
        service_test_classes = [TestFishService, TestIDService]
        
        for test_class in service_test_classes:
            test_instance = test_class()
            test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
            
            for test_method in test_methods:
                try:
                    getattr(test_instance, test_method)()
                except Exception as e:
                    print(f"  FAIL: {test_class.__name__}.{test_method} - {e}")
                    return False
        
        print("  PASS All service tests passed!")
        
        # Test Storage
        print("\nSTORAGE Testing Storage Layer...")
        from test_storage import TestStorage
        
        storage_test = TestStorage()
        test_methods = [method for method in dir(storage_test) if method.startswith('test_')]
        
        for test_method in test_methods:
            try:
                storage_test.setup_method()  # Clear storage before each test
                getattr(storage_test, test_method)()
            except Exception as e:
                print(f"  FAIL: TestStorage.{test_method} - {e}")
                return False
        
        print("  PASS All storage tests passed!")
        
        # Test Core
        print("\nCORE Testing Core Functionality...")
        from test_core import TestSettings, TestLogging, TestExceptions, TestCoreIntegration
        
        core_test_classes = [TestSettings, TestLogging, TestExceptions, TestCoreIntegration]
        
        for test_class in core_test_classes:
            test_instance = test_class()
            test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
            
            for test_method in test_methods:
                try:
                    getattr(test_instance, test_method)()
                except Exception as e:
                    print(f"  FAIL: {test_class.__name__}.{test_method} - {e}")
                    return False
        
        print("  PASS All core tests passed!")
        
        # Test Routes
        print("\nROUTES Testing API Routes...")
        from test_routes import TestRoutes
        
        routes_test = TestRoutes()
        test_methods = [method for method in dir(routes_test) if method.startswith('test_')]
        
        for test_method in test_methods:
            try:
                routes_test.setup_method()  # Clear storage before each test
                getattr(routes_test, test_method)()
            except Exception as e:
                print(f"  FAIL: TestRoutes.{test_method} - {e}")
                return False
        
        print("  PASS All route tests passed!")
        
        # Test Integration
        print("\nINTEGRATION Testing Integration Workflows...")
        from test_integration import TestIntegration
        
        integration_test = TestIntegration()
        test_methods = [method for method in dir(integration_test) if method.startswith('test_')]
        
        for test_method in test_methods:
            try:
                integration_test.setup_method()  # Clear storage before each test
                getattr(integration_test, test_method)()
            except Exception as e:
                print(f"  FAIL: TestIntegration.{test_method} - {e}")
                return False
        
        print("  PASS All integration tests passed!")
        
        print("\n" + "=" * 60)
        print("SUCCESS SUCCESS: ALL COMPREHENSIVE TESTS PASSED!")
        print("READY Your Dopamine Hunter backend is working perfectly!")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\nFAIL FAILED: Test suite failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

def run_specific_test_suite(suite_name):
    """Run a specific test suite"""
    suites = {
        'models': 'test_models',
        'services': 'test_services', 
        'storage': 'test_storage',
        'core': 'test_core',
        'routes': 'test_routes',
        'integration': 'test_integration'
    }
    
    if suite_name not in suites:
        print(f"Unknown test suite: {suite_name}")
        print(f"Available suites: {', '.join(suites.keys())}")
        return False
    
    print(f"Running {suite_name} test suite...")
    
    try:
        if suite_name == 'models':
            from test_models import (
                TestTaskCreate, TestTask, TestUserCreate, TestUser,
                TestFishCreate, TestFish, TestAchievement, TestEnums
            )
            test_classes = [
                TestTaskCreate, TestTask, TestUserCreate, TestUser,
                TestFishCreate, TestFish, TestAchievement, TestEnums
            ]
            
            for test_class in test_classes:
                test_instance = test_class()
                test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
                
                for test_method in test_methods:
                    try:
                        getattr(test_instance, test_method)()
                        print(f"  PASS {test_class.__name__}.{test_method}")
                    except Exception as e:
                        print(f"  FAIL {test_class.__name__}.{test_method} - {e}")
                        return False
        
        elif suite_name == 'services':
            from test_services import TestFishService, TestIDService
            
            for test_class in [TestFishService, TestIDService]:
                test_instance = test_class()
                test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
                
                for test_method in test_methods:
                    try:
                        getattr(test_instance, test_method)()
                        print(f"  PASS {test_class.__name__}.{test_method}")
                    except Exception as e:
                        print(f"  FAIL {test_class.__name__}.{test_method} - {e}")
                        return False
        
        elif suite_name == 'storage':
            from test_storage import TestStorage
            
            storage_test = TestStorage()
            test_methods = [method for method in dir(storage_test) if method.startswith('test_')]
            
            for test_method in test_methods:
                try:
                    storage_test.setup_method()
                    getattr(storage_test, test_method)()
                    print(f"  PASS TestStorage.{test_method}")
                except Exception as e:
                    print(f"  FAIL TestStorage.{test_method} - {e}")
                    return False
        
        elif suite_name == 'core':
            from test_core import TestSettings, TestLogging, TestExceptions, TestCoreIntegration
            
            for test_class in [TestSettings, TestLogging, TestExceptions, TestCoreIntegration]:
                test_instance = test_class()
                test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
                
                for test_method in test_methods:
                    try:
                        getattr(test_instance, test_method)()
                        print(f"  PASS {test_class.__name__}.{test_method}")
                    except Exception as e:
                        print(f"  FAIL {test_class.__name__}.{test_method} - {e}")
                        return False
        
        elif suite_name == 'routes':
            from test_routes import TestRoutes
            
            routes_test = TestRoutes()
            test_methods = [method for method in dir(routes_test) if method.startswith('test_')]
            
            for test_method in test_methods:
                try:
                    routes_test.setup_method()
                    getattr(routes_test, test_method)()
                    print(f"  PASS TestRoutes.{test_method}")
                except Exception as e:
                    print(f"  FAIL TestRoutes.{test_method} - {e}")
                    return False
        
        elif suite_name == 'integration':
            from test_integration import TestIntegration
            
            integration_test = TestIntegration()
            test_methods = [method for method in dir(integration_test) if method.startswith('test_')]
            
            for test_method in test_methods:
                try:
                    integration_test.setup_method()
                    getattr(integration_test, test_method)()
                    print(f"  PASS TestIntegration.{test_method}")
                except Exception as e:
                    print(f"  FAIL TestIntegration.{test_method} - {e}")
                    return False
        
        print(f"PASS {suite_name.title()} test suite passed!")
        return True
        
    except Exception as e:
        print(f"FAIL {suite_name} test suite failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        suite_name = sys.argv[1]
        success = run_specific_test_suite(suite_name)
    else:
        success = run_all_tests()
    
    sys.exit(0 if success else 1)
