# FitTracker - Fitness Tracker with Animated Progress Rings

A modern fitness tracking application built with Next.js, Express, PostgreSQL, and Chart.js featuring Apple Watch-style animated progress rings, drag-and-drop workout builder, and beautiful animated charts.

## Features

- **Animated Progress Rings** - Apple Watch-style activity rings for Move, Exercise, and Stand goals
- **Drag-and-Drop Workout Builder** - Create custom workouts with intuitive drag-and-drop interface
- **Animated Charts** - Weekly progress visualization with Chart.js (bar, line, doughnut charts)
- **Streak Tracking** - Automatic calculation of current and longest workout streaks
- **Achievements System** - Unlock badges for milestones (first workout, 10/50/100 workouts, 7/30/100 day streaks)
- **Workout Sessions** - Track active workouts with set-by-set logging
- **Weekly/Monthly Progress** - Visualize trends across multiple metrics
- **Dark Mode** - Full dark mode support with system preference detection
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Chart.js + react-chartjs-2** - Animated charts
- **@dnd-kit** - Drag and drop functionality
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Lucide React** - Beautiful icons

### Backend
- **Express.js** - Node.js web framework
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **Zod** - Schema validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitness-tracker.git
cd fitness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Frontend (`.env.local` in `frontend/`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Backend (`.env` in `backend/`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fitness_tracker
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Set up the database:
```bash
npm run db:push
```

5. Start development servers:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Project Structure

```
fitness-tracker/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API client
│   │   ├── store/           # Zustand store
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/                  # Express backend
│   ├── src/
│   │   ├── db/              # Database schema and connection
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── types/           # TypeScript types
│   └── package.json
└── package.json              # Root workspace config
```

## API Endpoints

### Workouts
- `GET /api/workouts` - List all workouts
- `GET /api/workouts/:id` - Get workout details
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Sessions
- `GET /api/sessions` - List workout sessions
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions` - Start new session
- `PUT /api/sessions/:id` - Update session
- `POST /api/sessions/:id/complete` - Complete session

### Stats
- `GET /api/stats/progress` - Weekly progress data
- `GET /api/stats/stats` - User statistics
- `PUT /api/stats/goals` - Update goals

## Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Railway/Render (Backend)
1. Connect GitHub repository
2. Set environment variables (DATABASE_URL, etc.)
3. Deploy

### Database
- Use Neon, Supabase, or Railway for managed PostgreSQL
- Run migrations on deploy: `npm run db:push`

## Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build all packages
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
```

## License

MIT License - feel free to use this project for learning or personal projects.