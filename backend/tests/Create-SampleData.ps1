# Make sure your FastAPI server is running first!
# Start the server with: cd backend && python main.py

Write-Host "Creating sample database entries..." -ForegroundColor Green

# Create a new user
Write-Host "Creating sample user..." -ForegroundColor Yellow
$userData = @{
    username = "dopamine_hunter"
    profile_pic = "https://example.com/hunter.jpg"
} | ConvertTo-Json

try {
    $user = Invoke-RestMethod -Uri "http://localhost:8000/users/" -Method POST -Body $userData -ContentType "application/json"
    Write-Host "User created with ID: $($user.id)" -ForegroundColor Green
    $userId = $user.id
} catch {
    Write-Host "Error creating user: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create sample tasks
Write-Host "Creating sample tasks..." -ForegroundColor Yellow
$tasks = @(
    @{
        title = "Morning workout"
        description = "Complete 30 minutes of exercise"
        status = "pending"
        user_id = $userId
    },
    @{
        title = "Read for 20 minutes"
        description = "Read a book or article for personal development"
        status = "completed"
        user_id = $userId
    },
    @{
        title = "Meditate"
        description = "Practice mindfulness meditation"
        status = "pending"
        user_id = $userId
    }
)

foreach ($taskData in $tasks) {
    try {
        $task = Invoke-RestMethod -Uri "http://localhost:8000/tasks/" -Method POST -Body ($taskData | ConvertTo-Json) -ContentType "application/json"
        Write-Host "Task created: $($task.title)" -ForegroundColor Green
    } catch {
        Write-Host "Error creating task '$($taskData.title)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create sample achievements
Write-Host "Creating sample achievements..." -ForegroundColor Yellow
$achievements = @(
    @{
        title = "Task Master"
        description = "Complete 10 tasks"
        achievement_type = "total_tasks"
        is_completed = $false
        user_id = $userId
        total_required = 10
        total_completed = 1
    },
    @{
        title = "Daily Streak"
        description = "Complete tasks for 7 days in a row"
        achievement_type = "streak"
        is_completed = $false
        user_id = $userId
        streak_required = 7
        current_streak = 2
    }
)

foreach ($achievementData in $achievements) {
    try {
        $achievement = Invoke-RestMethod -Uri "http://localhost:8000/achievements/" -Method POST -Body ($achievementData | ConvertTo-Json) -ContentType "application/json"
        Write-Host "Achievement created: $($achievement.title)" -ForegroundColor Green
    } catch {
        Write-Host "Error creating achievement '$($achievementData.title)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Sample data creation completed!" -ForegroundColor Green