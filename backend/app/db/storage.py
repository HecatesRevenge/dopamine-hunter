# in-memory storage
from ..models import User, Achievement, Task, Fish

# In-memory storage with proper typing
users: dict[int, User] = {}  # user_id -> User
achievements: dict[int, Achievement] = {}  # achievement_id -> Achievement
tasks: dict[int, Task] = {}  # task_id -> Task
fishes: dict[int, Fish] = {}  # fish_id -> Fish