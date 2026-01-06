# 🧠 Brain Wrangler

**ADHD-Friendly Pomodoro & Task Manager PWA**

A Progressive Web App built with React, designed specifically for people with ADHD. Combines a flexible Pomodoro timer with task management, while remaining forgiving and non-judgmental about workflow interruptions.

## Features

- **⏱️ Flexible Pomodoro Timer**: Multiple presets (10/2, 25/5, 50/10, 90/15) with pause, resume, and extend options
- **📋 Task Management**: Organize tasks through Inbox → Today → Doing → Done workflow
- **🎯 "Now" Task**: Focus on one task at a time without pressure
- **📊 Interruption Tracking**: Log and categorize derailments without judgment
- **📱 PWA Support**: Install on mobile devices and use offline
- **💾 Local-First**: All data stored locally using IndexedDB

## Tech Stack

- **Framework**: React 18.3.1 + TypeScript 5.5.4
- **Build Tool**: Vite 7.3.0
- **Database**: Dexie 4.0.8 (IndexedDB wrapper)
- **PWA**: vite-plugin-pwa 1.2.0
- **Architecture**: Modular, decoupled feature-based design

## Architecture

This application follows a **modular, feature-based architecture** with clear separation of concerns:

```
src/
├── core/                      # Core infrastructure
│   ├── db/                    # Database layer (Dexie client & schema)
│   └── types/                 # Global type definitions
├── modules/                   # Feature modules (fully decoupled)
│   ├── tasks/                 # Task management module
│   │   ├── components/        # Task UI components
│   │   ├── hooks/             # Task-specific hooks
│   │   └── services/          # Task business logic
│   ├── timer/                 # Pomodoro timer module
│   │   ├── components/        # Timer UI components
│   │   ├── hooks/             # Timer-specific hooks
│   │   └── services/          # Timer presets & logic
│   └── sessions/              # Sessions & interruptions module
│       ├── components/        # Session UI components
│       ├── hooks/             # Session-specific hooks
│       └── services/          # Session business logic
├── shared/                    # Shared utilities
│   ├── components/            # Reusable UI components (Button, Card)
│   ├── hooks/                 # Shared hooks (useLiveQuery)
│   └── utils/                 # Utility functions (time, storage)
├── styles/                    # Global styles & CSS variables
└── App.tsx                    # Main app orchestrator
```

### Key Design Principles

1. **Separation of Concerns**: Each module has services (business logic), hooks (state management), and components (UI)
2. **Decoupling**: Modules don't depend on each other directly; they communicate through the App component
3. **Type Safety**: Comprehensive TypeScript types for all data structures
4. **Reactive Data**: Uses Dexie's liveQuery for automatic UI updates
5. **Reusability**: Shared components and utilities prevent code duplication

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173/brain-wrangler/`

## Usage

### Installing as PWA

**iOS (Safari)**:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android (Chrome)**:
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"

### Task Workflow

1. **Brain Dump**: Quickly add tasks to your Inbox
2. **Plan**: Move tasks to "Today" when you're ready to work on them
3. **Focus**: Set a task as "Now" and start a Pomodoro session
4. **Track**: Log interruptions during focus sessions
5. **Complete**: Mark tasks as Done when finished

### Timer Presets

- **Short Sprint** (10/2): Quick focus bursts
- **Classic** (25/5): Traditional Pomodoro
- **Long** (50/10): Extended focus sessions
- **Deep Work** (90/15): Maximum deep work

## Module API

### Tasks Module

```typescript
import { useTasks, useNowTask, taskService } from './modules/tasks';

// Get tasks by status
const { tasks, service } = useTasks('today');

// Manage "now" task
const { nowTaskId, nowTask, setNowTask, clearNowTask } = useNowTask();

// Task operations
await taskService.createTask(data, 'inbox');
await taskService.markTaskDone(taskId);
await taskService.splitTask(taskId);
```

### Timer Module

```typescript
import { useTimer, TIMER_PRESETS } from './modules/timer';

const {
  state,
  remainingTime,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  extendTimer
} = useTimer();
```

### Sessions Module

```typescript
import { useSessions, sessionService } from './modules/sessions';

// Get recent sessions
const { sessions, service } = useSessions(undefined, 10);

// Manage sessions
await sessionService.startSession(taskId, 'focus', 1500);
await sessionService.addInterruption(sessionId, 'thought', 'Random idea');
await sessionService.endSession(sessionId, 1450);
```

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Acknowledgments

Built with compassion for the ADHD community. Because sometimes you just need a tool that understands how your brain works.
