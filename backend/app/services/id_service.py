"""Service for generating unique IDs across the application"""

class IDService:
    """Thread-safe ID generation service"""
    
    def __init__(self):
        self._user_id_counter = 0
        self._task_id_counter = 0
        self._fish_id_counter = 0
        self._achievement_id_counter = 0
    
    def generate_user_id(self) -> int:
        """Generate a unique user ID"""
        self._user_id_counter += 1
        return self._user_id_counter
    
    def generate_task_id(self) -> int:
        """Generate a unique task ID"""
        self._task_id_counter += 1
        return self._task_id_counter
    
    def generate_fish_id(self) -> int:
        """Generate a unique fish ID"""
        self._fish_id_counter += 1
        return self._fish_id_counter
    
    def generate_achievement_id(self) -> int:
        """Generate a unique achievement ID"""
        self._achievement_id_counter += 1
        return self._achievement_id_counter

# Global instance
id_service = IDService()
