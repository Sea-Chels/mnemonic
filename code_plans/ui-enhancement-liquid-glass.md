# UI Enhancement Plan: Liquid Glass Effects & Visual Polish

## 1. **Liquid Glass Tab Bar**
- Install `expo-blur` for blur effects
- Create a `GlassTabBar` component that wraps the existing tab navigation
- Apply:
  - Semi-transparent background with blur effect
  - Adaptive opacity based on theme (darker for light theme, lighter for dark theme)
  - Ensure text/icon contrast remains high across all themes
  - Add subtle gradient overlay for depth

## 2. **Deck Photo Feature**
### Database Changes:
- Add `image_uri` column to the `decks` table in schema.sql
- Run migration to update existing database

### Implementation:
- Install `expo-image-picker` for photo selection
- Update Deck type interface to include `image_uri?: string`
- Modify deck creation/edit modal to include photo picker
- Update `DecksListScreen` to show deck images as background cards
- In `DeckDetailScreen`, display image as a muted banner at top

## 3. **Enhanced Flip Animations**
- Improve existing `AnimatedFlashcard` component:
  - Add 3D perspective to flip animation
  - Include subtle shadow changes during flip
  - Add haptic feedback on flip (expo-haptics)
  - Smooth easing curves for more natural motion

## 4. **Reusable Glass Components**
Create new components in `/src/ui/components/Glass/`:
- `GlassContainer.tsx` - Reusable glass morphism container
- `GlassCard.tsx` - Card with glass effect
- `GlassModal.tsx` - Modal with blurred background

## 5. **Additional Glass Effects**
Apply glass morphism to:
- Settings screen cards
- Study statistics cards
- Modal backgrounds
- Progress bars with glass containers
- Navigation headers (subtle glass effect)

## 6. **Theme Adjustments**
Update theme files to include:
- Glass opacity values for each theme
- Blur intensity settings
- Ensure sufficient contrast ratios for accessibility

## Technical Implementation:
1. Install required packages: `expo-blur`, `expo-image-picker`, `expo-haptics`
2. Create glass component library
3. Update database schema and migration
4. Implement photo picker in deck management
5. Apply glass effects progressively throughout the app
6. Test across all themes for visibility and aesthetics

This will create a modern, polished UI with cohesive glass morphism design while maintaining excellent usability across all themes.