# Pixel Art Asset Placeholders

## Progress Ring Assets
**Dimensions: 64x64 pixels**
- Location: `public/placeholders/progress-placeholder-64x64.png`
- Format: PNG with transparency
- Style: Pixel art character/icon
- Usage: Displays in center of circular progress meters

### How to Replace:
**Option 1: Single Image for All Categories**
1. Create your 64x64 pixel art asset
2. Save as PNG with transparent background
3. Replace `public/placeholders/progress-placeholder-64x64.png`
4. Asset will automatically appear in all progress rings

**Option 2: Category-Specific Images (Recommended)**
1. Create separate 64x64 pixel art assets for each category
2. Save as PNG with transparent background
3. Place in `public/placeholders/categories/` with naming format: `{category-name}-64x64.png`
4. Current categories and their expected filenames:
   - Morning Routine → `morning-routine-64x64.png`
   - Study Session → `study-session-64x64.png`
   - Exercise → `exercise-64x64.png`
   - Meditation → `meditation-64x64.png`
5. If category-specific image doesn't exist, falls back to default placeholder

## Streak Banner Assets
**Dimensions: 400x80 pixels (High Resolution)**
- Location: `public/placeholders/banners/`
- Format: PNG with transparency
- Style: Pixel art banner/decoration
- Usage: Displays as background image for streak statistics cards

### Banner Types:
- **Current Streak**: `current-streak-banner-400x80.png` - For active daily streak display
- **Best Streak**: `best-streak-banner-400x80.png` - For personal record streak display
- **Focus Time**: `focus-time-banner-400x80.png` - For focus session time display

### How to Replace:
1. Create your 400x80 pixel art banners for each type (2x resolution for crisp display)
2. Save as PNG (transparency optional - image covers full card background)
3. Replace the specific banner files in `public/placeholders/banners/`
4. Banners will automatically appear as backgrounds with text/icons overlaid

### Current Placeholders:
All banner placeholders are currently generated from the `seabackground.png` file scaled to 400x80 pixels, maintaining the beautiful ocean pixel art aesthetic while providing much sharper image quality.

### Design Tips for Banner Backgrounds:
- Use darker or muted colors for better text readability
- The system adds a semi-transparent overlay to ensure text visibility
- Icons get rounded backgrounds and drop shadows when over banner images
- Consider the responsive design - banners scale with card size
- Higher resolution (400x80) provides crisp display on all screen densities

## Achievement Icons
**Dimensions: 32x32 pixels**
- Location: `public/placeholders/achievements/`
- Format: PNG with transparency
- Style: Pixel art icons
- Naming: `achievement-{name}-32x32.png`

### Available Achievement Slots:
- `achievement-first-task-32x32.png` - First task completion
- `achievement-week-streak-32x32.png` - 7-day streak
- `achievement-focus-master-32x32.png` - Focus session milestone
- `achievement-early-bird-32x32.png` - Morning task completion
- `achievement-night-owl-32x32.png` - Evening task completion

### How to Add Achievement Icons:
1. Create 32x32 pixel art icons for each achievement
2. Save as PNG with transparent background
3. Place in `public/placeholders/achievements/` folder
4. Use exact naming convention above
5. Update achievement data in components to reference new icons

## Step-by-Step Asset Update Process:

### For Progress Ring Characters:
1. Open your pixel art editor (Aseprite, Piskel, etc.)
2. Create new 64x64 canvas
3. Design your character/icon with pixel art style
4. Export as PNG with transparency
5. Replace `public/placeholders/progress-placeholder-64x64.png`

### For Streak Banners:
1. Create new 200x40 canvas
2. Design decorative banner element
3. Export as PNG with transparency
4. Replace `public/placeholders/streak-banner-200x40.png`

### For Achievement Icons:
1. Create new 32x32 canvas for each achievement
2. Design unique pixel art icon for each achievement type
3. Export each as PNG with transparency
4. Place in `public/placeholders/achievements/` with correct naming
5. Update achievement components to use custom icons instead of Lucide icons

## Design Guidelines:
- Use consistent pixel art style across all assets
- Maintain high contrast for readability
- Use limited color palette for cohesive look
- Ensure assets work well on both light and dark themes
- Test assets at actual display size before finalizing