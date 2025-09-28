"""Custom exceptions for the Dopamine Hunter application"""

class DopamineHunterException(Exception):
    """Base exception for the application"""
    pass

class UserNotFoundError(DopamineHunterException):
    """Raised when a user is not found"""
    pass

class DuplicateUsernameError(DopamineHunterException):
    """Raised when trying to create a user with existing username"""
    pass

class TaskNotFoundError(DopamineHunterException):
    """Raised when a task is not found"""
    pass

class FishNotFoundError(DopamineHunterException):
    """Raised when a fish is not found"""
    pass

class AchievementNotFoundError(DopamineHunterException):
    """Raised when an achievement is not found"""
    pass

class InvalidOperationError(DopamineHunterException):
    """Raised when an invalid operation is attempted"""
    pass
