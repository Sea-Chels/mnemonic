# Mnemonic - React Native TypeScript Flashcard App

## Project Overview
A comprehensive React Native TypeScript flashcard application with robust design system, local SQLite storage, and spaced repetition algorithm.

## Technology Stack
- **Framework**: React Native with Expo TypeScript
- **UI Library**: UI Kitten (Eva Design System)
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: Zustand
- **Database**: SQLite (expo-sqlite)
- **Styling**: UI Kitten + Eva Design themes
- **Algorithm**: SM-2 Spaced Repetition

## Architecture

### Database Schema
```sql
-- Decks table
CREATE TABLE decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3366FF',
    icon TEXT DEFAULT 'book',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Flashcards table
CREATE TABLE flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty INTEGER DEFAULT 0,
    interval INTEGER DEFAULT 1,
    repetitions INTEGER DEFAULT 0,
    ease_factor REAL DEFAULT 2.5,
    next_review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- Study sessions table
CREATE TABLE study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    cards_studied INTEGER DEFAULT 0,
    cards_correct INTEGER DEFAULT 0,
    study_duration INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);
```

### File Structure
```
src/
├── contexts/
│   └── DatabaseContext.tsx          # SQLite context with error handling
├── hooks/
│   ├── decks/
│   │   ├── useDecks.ts              # CRUD operations for decks
│   │   └── useDeckStats.ts          # Statistics and analytics
│   ├── flashcards/
│   │   ├── useFlashcards.ts         # CRUD operations for flashcards
│   │   └── useSpacedRepetition.ts   # SM-2 algorithm implementation
│   └── study/
│       ├── useStudySession.ts       # Study session management
│       └── useStudyStats.ts         # Study analytics
├── navigation/
│   ├── TabNavigator.tsx             # Bottom tab navigation
│   ├── DecksStack.tsx               # Decks screen stack
│   ├── StudyStack.tsx               # Study screen stack
│   └── types.ts                     # Navigation type definitions
├── screens/
│   ├── Decks/
│   │   ├── DecksListScreen.tsx      # Main decks overview
│   │   ├── DeckDetailScreen.tsx     # Individual deck management
│   │   └── CreateDeckScreen.tsx     # Deck creation
│   ├── Flashcards/
│   │   ├── FlashcardListScreen.tsx  # Cards in a deck
│   │   ├── CreateCardScreen.tsx     # Card creation/editing
│   │   └── ImportCardsScreen.tsx    # Bulk card import
│   ├── Study/
│   │   ├── StudyHomeScreen.tsx      # Study dashboard
│   │   ├── StudySessionScreen.tsx   # Active study session
│   │   └── StudyStatsScreen.tsx     # Progress analytics
│   └── Settings/
│       └── SettingsScreen.tsx       # App preferences
├── ui/
│   ├── components/
│   │   ├── Card/
│   │   │   ├── FlashcardComponent.tsx
│   │   │   ├── DeckCard.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── Layout/
│   │   │   ├── ScreenContainer.tsx
│   │   │   └── SafeAreaContainer.tsx
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── types.ts
│   │   ├── Input/
│   │   │   ├── TextInput.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── Progress/
│   │   │   ├── ProgressBar.tsx
│   │   │   └── CircularProgress.tsx
│   │   ├── Loading/
│   │   │   └── LoadingSpinner.tsx
│   │   ├── Empty/
│   │   │   └── EmptyState.tsx
│   │   └── Typography/
│   │       └── Text.tsx
│   └── theme/
│       ├── light-theme.json         # Light theme configuration
│       ├── dark-theme.json          # Dark theme configuration
│       ├── custom-theme.json        # Custom theme configuration
│       ├── spacing.ts               # Consistent spacing values
│       └── types.ts                 # Theme type definitions
├── stores/
│   ├── themeStore.ts                # Theme management with Zustand
│   ├── studyStore.ts                # Study session state
│   └── settingsStore.ts             # App preferences
└── utils/
    ├── spacedRepetition.ts          # SM-2 algorithm utilities
    ├── dateUtils.ts                 # Date formatting and calculations
    └── validationUtils.ts           # Input validation helpers
```

## Design System

### Theme Structure
- **Light Theme**: Primary blues, clean whites, subtle grays
- **Dark Theme**: Deep backgrounds, high contrast text, accent blues
- **Custom Theme**: User-configurable colors and preferences

### Component Variants
- **Buttons**: Primary, secondary, outline, text, danger
- **Cards**: Default, elevated, outlined, interactive
- **Inputs**: Default, search, multiline, validation states
- **Typography**: Display, heading, body, caption, with size variants

### Spacing System
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
```

## Core Features

### 1. Deck Management
- Create, edit, delete decks
- Organize cards within decks
- Deck statistics and progress tracking
- Import/export functionality

### 2. Flashcard System
- Rich text support for questions and answers
- Image support for visual learning
- Bulk card creation and editing
- Card difficulty tracking

### 3. Spaced Repetition (SM-2 Algorithm)
- Intelligent scheduling based on performance
- Adaptive difficulty adjustment
- Optimal review timing
- Long-term retention optimization

### 4. Study Sessions
- Focused study mode with timer
- Progress tracking during sessions
- Performance analytics
- Review scheduling

### 5. Analytics & Progress
- Study streaks and consistency tracking
- Deck-specific performance metrics
- Time-based progress visualization
- Achievement system

## Implementation Phases

### Phase 1: Foundation
1. Project setup with Expo TypeScript
2. UI Kitten integration and theme system
3. Database schema and context setup
4. Basic navigation structure

### Phase 2: Core Functionality
1. Deck CRUD operations
2. Flashcard management
3. Basic study session implementation
4. Theme switching system

### Phase 3: Advanced Features
1. Spaced repetition algorithm
2. Study analytics and statistics
3. Import/export functionality
4. Performance optimizations

### Phase 4: Polish & Enhancement
1. Animations and micro-interactions
2. Advanced theming options
3. Data backup and sync preparation
4. User experience refinements

## Development Guidelines

### Code Organization
- Use custom hooks for all database operations
- Implement proper error boundaries
- Follow TypeScript strict mode
- Use absolute imports with path aliases

### Performance Considerations
- Implement lazy loading for large card sets
- Use FlatList for efficient rendering
- Optimize database queries with indexing
- Implement proper memoization

### Testing Strategy
- Unit tests for utility functions
- Integration tests for database operations
- Component testing with React Native Testing Library
- End-to-end testing for critical user flows

## Database Operations Pattern

### Context Provider
```typescript
export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Database initialization and connection management
  // Error handling and recovery
  // Migration management
};
```

### Custom Hooks Pattern
```typescript
export const useDecks = () => {
  // getAllDecks, getDeckById, createDeck, updateDeck, deleteDeck
  // Real-time updates with React state
  // Error handling and loading states
};
```

### Query Separation
- Separate files for each entity (decks, flashcards, sessions)
- Prepared statements for security
- Transaction support for complex operations
- Proper indexing for performance

This plan provides a comprehensive foundation for building a professional-grade flashcard application with modern React Native practices and robust architecture.