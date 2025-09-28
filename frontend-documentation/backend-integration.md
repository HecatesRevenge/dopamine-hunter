# Backend Integration Documentation

## Streak Counter API Requirements

### Overview
The frontend has implemented a Total Streak Counter that tracks user page visits and daily streaks. This document outlines the required backend API endpoints to replace the current localStorage mock implementation.

### Current Implementation Location
**File**: `/frontend/src/pages/Home.tsx`
**Function**: `updateStreakCounter()` (lines 30-75)

### Required API Endpoint

#### POST `/api/users/{user_id}/streak/visit`
**Purpose**: Record a page visit and update streak counters

**Request:**
```http
POST /api/users/{user_id}/streak/visit
Content-Type: application/json
```

**Response:**
```json
{
  "totalVisits": 42,
  "currentDailyStreak": 7,
  "bestStreak": 14,
  "lastVisitDate": "2024-09-28"
}
```

### Streak Logic Requirements

1. **First Visit**:
   - `currentDailyStreak = 1`
   - `totalVisits = 1`
   - `bestStreak = 1`

2. **Same Day Visit**:
   - Only increment `totalVisits`
   - Keep streak unchanged

3. **Consecutive Day Visit**:
   - Increment `currentDailyStreak`
   - Increment `totalVisits`
   - Update `bestStreak` if current > best

4. **Missed Day Visit**:
   - Reset `currentDailyStreak = 1`
   - Increment `totalVisits`
   - Keep `bestStreak` unchanged

### Database Schema Suggestion

```sql
CREATE TABLE user_streaks (
    user_id VARCHAR(255) PRIMARY KEY,
    total_visits INTEGER DEFAULT 0,
    current_daily_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_visit_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Frontend Integration

**Replace this mock code** (in `Home.tsx`):
```javascript
// TODO: Replace with actual API call
// const response = await fetch('/api/users/current/streak/visit', { method: 'POST' });
// const data = await response.json();

// Mock implementation for now
const today = new Date().toDateString();
// ... localStorage logic ...
```

**With this API call**:
```javascript
const updateStreakCounter = async () => {
  try {
    const response = await fetch('/api/users/current/streak/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers as needed
      }
    });

    if (!response.ok) {
      throw new Error('Failed to update streak');
    }

    const data = await response.json();
    setStreakData({
      totalVisits: data.totalVisits,
      currentDailyStreak: data.currentDailyStreak,
      bestStreak: data.bestStreak,
      lastVisitDate: data.lastVisitDate
    });

    return data;
  } catch (error) {
    console.error('Error updating streak:', error);
    // Fallback to localStorage or show error to user
  }
};
```

### Progress Ring Display

The frontend calculates progress percentage using:
```javascript
const streakProgress = Math.min((streakData.currentDailyStreak / 30) * 100, 100);
```

This shows progress toward a 30-day streak mastery goal.

### Testing

**Endpoints to test**:
1. First user visit
2. Same day multiple visits
3. Consecutive day visits
4. Visits after missing days
5. Long streak progression

### Error Handling

The frontend should handle:
- Network errors (fallback to localStorage)
- Authentication errors
- Server errors (5xx)
- Invalid responses

### Security Considerations

- Implement proper user authentication
- Rate limiting to prevent abuse
- Input validation for user_id
- CORS configuration for frontend domain

---

## Additional Future Endpoints

### GET `/api/users/{user_id}/streak`
Get current streak data without incrementing

### POST `/api/users/{user_id}/streak/reset`
Reset streak counters (admin/testing)

### GET `/api/leaderboard/streaks`
Get top streak holders for gamification