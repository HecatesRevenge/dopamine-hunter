# Dopamine Hunter Backend

## Installation

1. (Optional) Activate virtual environment
```bash
.venv/Scripts/activate
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```

1. Run the server:
```bash
cd backend; python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Users
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/{user_id}` - Get a specific user

### Tasks
- `GET /tasks` - Get all tasks (optionally filter by user_id)
- `POST /tasks` - Create a new task
- `GET /tasks/{task_id}` - Get a specific task
- `PUT /tasks/{task_id}` - Update a task
- `DELETE /tasks/{task_id}` - Delete a task

### Achievements
- `GET /achievements` - Get all achievements (optionally filter by user_id)
- `POST /achievements` - Create a new achievement
- `GET /achievements/{achievement_id}` - Get a specific achievement
- `PUT /achievements/{achievement_id}` - Update an achievement

### Health
- `GET /health` - Health check endpoint

## Models

### User
- `id`: Unique identifier
- `username`: User's username
- `profile_pic`: Optional profile picture URL
- `created_at`: Creation timestamp

### Task
- `id`: Unique identifier
- `title`: Task title
- `description`: Optional task description
- `status`: Task status (pending, completed, cancelled)
- `created_at`: Creation timestamp
- `completed_at`: Completion timestamp
- `user_id`: Associated user ID

### Achievement
- `id`: Unique identifier
- `title`: Achievement title
- `description`: Achievement description
- `achievement_type`: Type of achievement (streak, total_tasks, custom)
- `is_completed`: Completion status
- `created_at`: Creation timestamp
- `completed_at`: Completion timestamp
- `user_id`: Associated user ID
- `streak_required`: Required streak for streak achievements
- `current_streak`: Current streak count
- `total_required`: Required total for total task achievements
- `total_completed`: Current total count


# Info for AI's benefit:

## Testing

The project includes a comprehensive test suite in the `tests/` directory:

```bash
# Run all tests
cd backend/tests
python run_all_tests.py

# Run individual test files
python test_health.py
python test_users.py
python test_tasks.py
python test_achievements.py
python test_database.py
```

Tests cover:
- ✅ API endpoint functionality
- ✅ Database operations
- ✅ Error handling
- ✅ Data validation
- ✅ File persistence


## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── models.py              # Pydantic models
│   ├── db/
│   │   ├──database.py     # File-based storage functions
│   │   ├── data/          # Data for the database
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── api.py         # API router configuration
│   │   ├── users.py    # User endpoints
│   │   ├── tasks.py       # Task endpoints
│   │   └── achievements.py # Achievement endpoints
│   └── core/
│       ├── __init__.py
│       └── config.py          # Application settings
├── data/                      # JSON file storage
│   ├── users.json          # User data
│   ├── tasks.json             # Task data
│   └── achievements.json      # Achievement data
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Dependencies
└── README.md                  # This file
```

## Features

- **Users**: User user management
- **Tasks**: Task creation, completion, and tracking
- **Achievements**: Achievement system with streak and total task tracking
- **File-based Storage**: Persistent JSON file storage (no database required)
- **Clean Architecture**: Separated concerns with models, routes, and configuration

## Development

The project follows FastAPI best practices with:
- **Separation of concerns**: Models, routes, and configuration are in separate files
- **File-based storage**: Persistent JSON file storage (no database required)
- **Configuration management**: Settings can be overridden with environment variables
- **Type safety**: Full Pydantic model validation
- **Documentation**: Automatic OpenAPI/Swagger documentation
- **Testing**: Comprehensive test suite for all functionality
