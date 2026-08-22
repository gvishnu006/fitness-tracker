export interface Workout {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  duration: number | null;
  caloriesBurned: number | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isTemplate: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  workoutId: number;
  name: string;
  sets: number;
  reps: number;
  weight: string | null;
  duration: number | null;
  restTime: number;
  order: number;
  notes: string | null;
  createdAt: string;
}

export interface Session {
  id: number;
  userId: number;
  workoutId: number | null;
  name: string;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  caloriesBurned: number | null;
  totalVolume: string | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  notes: string | null;
  createdAt: string;
  sessionExercises: SessionExercise[];
}

export interface SessionExercise {
  id: number;
  sessionId: number;
  exerciseId: number | null;
  name: string;
  sets: number;
  reps: number;
  weight: string | null;
  duration: number | null;
  restTime: number;
  order: number;
  completedSets: CompletedSet[];
  createdAt: string;
}

export interface CompletedSet {
  set: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface UserStats {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  lastWorkoutDate: string | null;
  weeklyGoal: number;
  dailyGoalMinutes: number;
  dailyGoalCalories: number;
  createdAt: string;
  updatedAt: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  userId: number;
  type: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  createdAt: string;
}

export interface WeeklyProgress {
  date: string;
  workouts: number;
  duration: number;
  calories: number;
  volume: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';