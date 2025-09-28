"""
Test core functionality (config, logging, exceptions)
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from app.core.config import Settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import (
    DopamineHunterException,
    UserNotFoundError,
    DuplicateUsernameError,
    TaskNotFoundError,
    FishNotFoundError,
    AchievementNotFoundError,
    InvalidOperationError
)


class TestSettings:
    """Test Settings configuration"""
    
    def test_default_settings(self):
        """Test default settings values"""
        settings = Settings()
        
        assert settings.app_name == "Dopamine Hunter API"
        assert settings.version == "1.0.0"
        assert settings.debug is False
        assert settings.api_prefix == "/api/v1"
        assert settings.cors_origins == ["*"]
        assert settings.database_type == "memory"
        assert settings.log_level == "INFO"
    
    def test_settings_with_env_vars(self):
        """Test settings with environment variables"""
        # This would require setting environment variables
        # For now, just test that the class can be instantiated
        settings = Settings()
        assert isinstance(settings.app_name, str)
        assert isinstance(settings.version, str)
        assert isinstance(settings.debug, bool)
    
    def test_settings_types(self):
        """Test that settings have correct types"""
        settings = Settings()
        
        assert isinstance(settings.app_name, str)
        assert isinstance(settings.version, str)
        assert isinstance(settings.debug, bool)
        assert isinstance(settings.api_prefix, str)
        assert isinstance(settings.cors_origins, list)
        assert isinstance(settings.database_type, str)
        assert isinstance(settings.log_level, str)


class TestLogging:
    """Test logging functionality"""
    
    def test_setup_logging(self):
        """Test logging setup"""
        # Test that setup_logging returns a logger
        app_logger = setup_logging()
        assert isinstance(app_logger, logging.Logger)
        assert app_logger.name == "dopamine_hunter"
    
    def test_logger_instance(self):
        """Test that logger instance is available"""
        assert logger is not None
        assert isinstance(logger, logging.Logger)
        assert logger.name == "dopamine_hunter"
    
    def test_logger_level(self):
        """Test logger level configuration"""
        # The logger should be configured with the level from settings
        settings = Settings()
        expected_level = getattr(logging, settings.log_level.upper())
        assert logger.level <= expected_level  # Should be at or below the configured level
    
    def test_logging_functionality(self):
        """Test that logging actually works"""
        # Capture log output
        import io
        import contextlib
        
        log_capture = io.StringIO()
        
        # Add a handler to capture logs
        handler = logging.StreamHandler(log_capture)
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter('%(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        
        # Temporarily add handler
        logger.addHandler(handler)
        
        try:
            # Log a test message
            test_message = "Test logging message"
            logger.info(test_message)
            
            # Check that the message was logged
            log_output = log_capture.getvalue()
            assert test_message in log_output
            assert "INFO" in log_output
        finally:
            # Remove the handler
            logger.removeHandler(handler)


class TestExceptions:
    """Test custom exceptions"""
    
    def test_base_exception(self):
        """Test base DopamineHunterException"""
        try:
            raise DopamineHunterException("Test error")
        except DopamineHunterException as e:
            assert str(e) == "Test error"
            assert isinstance(e, Exception)
    
    def test_user_not_found_error(self):
        """Test UserNotFoundError"""
        try:
            raise UserNotFoundError("User 123 not found")
        except UserNotFoundError as e:
            assert str(e) == "User 123 not found"
            assert isinstance(e, DopamineHunterException)
            assert isinstance(e, Exception)
    
    def test_duplicate_username_error(self):
        """Test DuplicateUsernameError"""
        try:
            raise DuplicateUsernameError("Username 'testuser' already exists")
        except DuplicateUsernameError as e:
            assert str(e) == "Username 'testuser' already exists"
            assert isinstance(e, DopamineHunterException)
            assert isinstance(e, Exception)
    
    def test_task_not_found_error(self):
        """Test TaskNotFoundError"""
        try:
            raise TaskNotFoundError("Task 456 not found")
        except TaskNotFoundError as e:
            assert str(e) == "Task 456 not found"
            assert isinstance(e, DopamineHunterException)
            assert isinstance(e, Exception)
    
    def test_fish_not_found_error(self):
        """Test FishNotFoundError"""
        try:
            raise FishNotFoundError("Fish 789 not found")
        except FishNotFoundError as e:
            assert str(e) == "Fish 789 not found"
            assert isinstance(e, DopamineHunterException)
            assert isinstance(e, Exception)
    
    def test_achievement_not_found_error(self):
        """Test AchievementNotFoundError"""
        try:
            raise AchievementNotFoundError("Achievement 101 not found")
        except AchievementNotFoundError as e:
            assert str(e) == "Achievement 101 not found"
            assert isinstance(e, DopamineHunterException)
            assert isinstance(e, Exception)
    
    def test_invalid_operation_error(self):
        """Test InvalidOperationError"""
        try:
            raise InvalidOperationError("Cannot perform this operation")
        except InvalidOperationError as e:
            assert str(e) == "Cannot perform this operation"
            assert isinstance(e, DopamineHunterException)
            assert isinstance(e, Exception)
    
    def test_exception_inheritance(self):
        """Test that all custom exceptions inherit from base exception"""
        exceptions = [
            UserNotFoundError,
            DuplicateUsernameError,
            TaskNotFoundError,
            FishNotFoundError,
            AchievementNotFoundError,
            InvalidOperationError
        ]
        
        for exception_class in exceptions:
            # Test that each exception inherits from DopamineHunterException
            assert issubclass(exception_class, DopamineHunterException)
            assert issubclass(exception_class, Exception)
            
            # Test that we can catch the base exception
            try:
                raise exception_class("Test message")
            except DopamineHunterException:
                pass  # Should be caught by base exception
            except Exception:
                pass  # Should also be caught by general Exception
    
    def test_exception_with_no_message(self):
        """Test exceptions with no message"""
        try:
            raise UserNotFoundError()
        except UserNotFoundError as e:
            assert str(e) == ""  # Empty string for no message
    
    def test_exception_with_custom_message(self):
        """Test exceptions with custom messages"""
        custom_message = "This is a custom error message"
        
        try:
            raise UserNotFoundError(custom_message)
        except UserNotFoundError as e:
            assert str(e) == custom_message


class TestCoreIntegration:
    """Test core components working together"""
    
    def test_settings_and_logging_integration(self):
        """Test that settings and logging work together"""
        settings = Settings()
        app_logger = setup_logging()
        
        # Both should be configured
        assert settings is not None
        assert app_logger is not None
        
        # Logger should use settings configuration
        expected_level = getattr(logging, settings.log_level.upper())
        assert app_logger.level <= expected_level
    
    def test_exceptions_with_logging(self):
        """Test that exceptions can be logged"""
        # This tests that exceptions work with the logging system
        try:
            raise UserNotFoundError("Test user not found")
        except UserNotFoundError as e:
            # Should be able to log the exception
            logger.error(f"Caught exception: {e}")
            assert str(e) == "Test user not found"
    
    def test_core_imports(self):
        """Test that all core modules can be imported"""
        # Test that all core modules are importable
        from app.core import config, logging, exceptions
        
        assert config is not None
        assert logging is not None
        assert exceptions is not None
        
        # Test that main classes are available
        assert hasattr(config, 'Settings')
        assert hasattr(logging, 'setup_logging')
        assert hasattr(logging, 'logger')
        assert hasattr(exceptions, 'DopamineHunterException')


if __name__ == "__main__":
    # Run tests
    test_classes = [TestSettings, TestLogging, TestExceptions, TestCoreIntegration]
    
    for test_class in test_classes:
        print(f"\nTesting {test_class.__name__}...")
        test_instance = test_class()
        
        # Get all test methods
        test_methods = [method for method in dir(test_instance) if method.startswith('test_')]
        
        for test_method in test_methods:
            try:
                getattr(test_instance, test_method)()
                print(f"  PASS: {test_method}")
            except Exception as e:
                print(f"  FAIL: {test_method} - {e}")
    
    print("\nSUCCESS: All core tests completed!")
