"""Service for user-related business logic"""

from datetime import datetime
from ..models import User
from ..db.database import get_users, _save_json_file, _model_to_dict, USERS_FILE
from ..core.logging import logger


class UserService:
    """Service class for user-related business logic"""
    
    @staticmethod
    def record_streak_visit(user_id: int) -> dict | None:
        """Record a page visit for streak tracking and return updated stats.

        Returns a dict with keys: totalVisits, currentDailyStreak, bestStreak, lastVisitDate
        """
        logger.info(f"Recording streak visit for user {user_id}")
        
        users = get_users()
        for i, user in enumerate(users):
            if user.id == user_id:
                now = datetime.now()
                # Determine day delta
                if user.last_login:
                    delta = now.date() - user.last_login.date()
                    if delta.days == 0:
                        # same day: only increment total_visits
                        user.total_visits = (user.total_visits or 0) + 1
                        logger.debug(f"Same day visit for user {user_id}, total_visits now {user.total_visits}")
                    elif delta.days == 1:
                        # consecutive day
                        user.login_streak = (user.login_streak or 0) + 1
                        user.total_visits = (user.total_visits or 0) + 1
                        logger.debug(f"Consecutive day visit for user {user_id}, streak now {user.login_streak}")
                    else:
                        # missed day(s)
                        user.login_streak = 1
                        user.total_visits = (user.total_visits or 0) + 1
                        logger.debug(f"Missed day visit for user {user_id}, streak reset to 1")
                else:
                    # first visit ever
                    user.login_streak = 1
                    user.total_visits = (user.total_visits or 0) + 1
                    logger.debug(f"First visit for user {user_id}")

                # update best streak
                if user.login_streak and user.login_streak > (user.best_streak or 0):
                    user.best_streak = user.login_streak
                    logger.debug(f"New best streak for user {user_id}: {user.best_streak}")

                user.last_login = now
                users[i] = user
                _save_json_file(USERS_FILE, [_model_to_dict(u) for u in users])

                stats = {
                    "totalVisits": user.total_visits,
                    "currentDailyStreak": user.login_streak,
                    "bestStreak": user.best_streak,
                    "lastVisitDate": user.last_login.date().isoformat()
                }
                
                logger.info(f"Streak visit recorded for user {user_id}: {stats}")
                return stats
        
        logger.warning(f"User {user_id} not found for streak visit")
        return None

    @staticmethod
    def update_login_streak(user: User) -> User:
        """Update login streak for a user based on last login date"""
        now = datetime.now()
        # simple streak logic: if last_login is yesterday or earlier, increase streak, else reset
        if user.last_login:
            delta = now.date() - user.last_login.date()
            if delta.days == 1:
                user.login_streak = (user.login_streak or 0) + 1
            elif delta.days > 1:
                user.login_streak = 1
        else:
            user.login_streak = 1

        user.last_login = now
        return user
