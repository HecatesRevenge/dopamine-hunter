# Progress Ring System Documentation

## Overview
The progress ring system displays user advancement in various categories with customizable icons and backgrounds.

## Components

### ProgressRing Component
**Location**: `/frontend/src/components/ui/progress-ring.tsx`

**Features**:
- Circular progress visualization (0-100%)
- Category-specific 64x64 pixel art icons
- Multiple sizes (sm, md, lg)
- Color themes (primary, success, accent, streak)
- Responsive design

### Current Categories

1. **Morning Routine** (75% progress)
   - Icon: `morning-routine-64x64.png`
   - Color: success (green theme)

2. **Study Session** (45% progress)
   - Icon: `study-session-64x64.png`
   - Color: primary (blue theme)

3. **Cleaning Path** (90% progress)
   - Icon: `cleaning-path-64x64.png` (maps to exercise)
   - Color: accent (purple theme)

4. **Total Streak** (dynamic progress)
   - Icon: `total-streak-64x64.png` (maps to meditation)
   - Color: streak (orange theme)
   - **Special**: Connected to backend streak counter

## Icon System

### Category Icons (64x64)
**Location**: `/frontend/public/placeholders/categories/`

**Naming Convention**: `{category-slug}-64x64.png`
- Categories converted to lowercase with hyphens
- Example: "Morning Routine" → `morning-routine-64x64.png`

**Current Icons**:
- `morning-routine-64x64.png`
- `study-session-64x64.png`
- `exercise-64x64.png` (used for "Cleaning Path")
- `meditation-64x64.png` (used for "Total Streak")

### Achievement Icons (32x32)
**Location**: `/frontend/public/placeholders/achievements/`

**Custom Icons Available**:
- `achievement-first-task-32x32.png`
- `gold_1_32x32.png`
- `silver_1_32x32.png`

## Backend Integration Points

### Progress Data Structure
```javascript
const inProgressTasks = [
  {
    title: "Category Name",
    progress: 0-100, // Percentage
    color: "theme", // primary|success|accent|streak
    category: "Category Name", // For icon mapping
    // Optional streak data for special categories
    streakData: {
      current: number,
      best: number,
      total: number
    }
  }
];
```

### API Integration Needed

**For each progress category, backend should provide**:
```javascript
// GET /api/users/{user_id}/progress
{
  "morningRoutine": {
    "completed": 15,
    "total": 20,
    "percentage": 75
  },
  "studySession": {
    "completed": 9,
    "total": 20,
    "percentage": 45
  },
  "cleaningPath": {
    "completed": 18,
    "total": 20,
    "percentage": 90
  },
  "totalStreak": {
    // Uses existing streak API
    "currentDailyStreak": 7,
    "bestStreak": 14,
    "percentage": 23.33 // (7/30)*100
  }
}
```

## Adding New Progress Categories

### Frontend Steps:
1. Add new category to `inProgressTasks` array
2. Create 64x64 icon: `/placeholders/categories/{category-slug}-64x64.png`
3. Choose appropriate color theme

### Backend Steps:
1. Add progress tracking for new category
2. Include in progress API response
3. Implement completion logic

## Customization

### Colors
Defined in Tailwind config and CSS variables:
- `primary`: Ocean blue theme
- `success`: Green theme
- `accent`: Purple theme
- `streak`: Orange/fire theme

### Sizes
- `sm`: 16x16 container, 8x8 icon
- `md`: 24x24 container, 12x12 icon
- `lg`: 32x32 container, 16x16 icon

### Icon Guidelines
- Use pixel art style
- Maintain transparency for background
- High contrast for readability
- Consistent color palette across icons

---

## Future Enhancements

1. **Animation**: Progress ring fill animations
2. **Achievements**: Unlock system at milestone percentages
3. **Customization**: User-selectable icon themes
4. **Gamification**: XP points, levels, rewards