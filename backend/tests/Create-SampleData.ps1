# Make sure your FastAPI server is running first!
# Start the server with: cd backend && python main.py

Write-Host "Creating sample database entries..." -ForegroundColor Green

# Create a new profile
Write-Host "Creating sample profile..." -ForegroundColor Yellow
$profileData = @{
    username = "dopamine_hunter"
    profile_pic = "https://example.com/hunter.jpg"
} | ConvertTo-Json

try {
    $profile = Invoke-RestMethod -Uri "http://localhost:8000/profiles/" -Method POST -Body $profileData -ContentType "application/json"
    Write-Host "Profile created with ID: $($profile.id)" -ForegroundColor Green
    $profileId = $profile.id
} catch {
    Write-Host "Error creating profile: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create sample tasks
Write-Host "Creating sample tasks..." -ForegroundColor Yellow
$tasks = @(
    @{
        title = "Morning workout"
        description = "Complete 30 minutes of exercise"
        status = "pending"
        profile_id = $profileId
    },
    @{
        title = "Read for 20 minutes"
        description = "Read a book or article for personal development"
        status = "completed"
        profile_id = $profileId
    },
    @{
        title = "Meditate"
        description = "Practice mindfulness meditation"
        status = "pending"
        profile_id = $profileId
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
        profile_id = $profileId
        total_required = 10
        total_completed = 1
    },
    @{
        title = "Daily Streak"
        description = "Complete tasks for 7 days in a row"
        achievement_type = "streak"
        is_completed = $false
        profile_id = $profileId
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