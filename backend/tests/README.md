# Backend Tests

Simple test suite for the Dopamine Hunter backend API.

## Running Tests

### Run All Tests
```bash
cd backend/tests
python run_all_tests.py
```

### Run Individual Test Files
```bash
cd backend/tests

# Test health endpoint
python test_health.py

# Test profile endpoints
python test_profiles.py

# Test task endpoints
python test_tasks.py

# Test achievement endpoints
python test_achievements.py

# Test database functions
python test_database.py
```

## Test Coverage

### API Endpoints
- ✅ Health endpoint
- ✅ Profile CRUD operations
- ✅ Task CRUD operations
- ✅ Achievement CRUD operations

### Database Functions
- ✅ Profile database operations
- ✅ Task database operations
- ✅ Achievement database operations

### Test Types
- ✅ Happy path testing
- ✅ Error handling (404s, invalid data)
- ✅ Data validation
- ✅ File persistence

## Test Data

Tests create temporary data that persists in the JSON files. This is intentional to test the file-based storage system. The tests are designed to be run multiple times safely.

## Dependencies

Tests use FastAPI's `TestClient` which is included with FastAPI. No additional testing frameworks are required.
