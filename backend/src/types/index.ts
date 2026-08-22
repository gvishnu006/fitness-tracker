import { z } from 'zod';

export const createWorkoutSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  caloriesBurned: z.number().int().positive().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  isTemplate: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  exercises: z.array(z.object({
    name: z.string().min(1).max(200),
    sets: z.number().int().positive().default(3),
    reps: z.number().int().positive().default(10),
    weight: z.number().positive().optional(),
    duration: z.number().int().positive().optional(),
    restTime: z.number().int().nonnegative().default(60),
    order: z.number().int().nonnegative().default(0),
    notes: z.string().optional(),
  })).default([]),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();

export const createSessionSchema = z.object({
  workoutId: z.number().int().positive().optional(),
  name: z.string().min(1).max(200),
  exercises: z.array(z.object({
    exerciseId: z.number().int().positive().optional(),
    name: z.string().min(1).max(200),
    sets: z.number().int().positive().default(3),
    reps: z.number().int().positive().default(10),
    weight: z.number().positive().optional(),
    duration: z.number().int().positive().optional(),
    restTime: z.number().int().nonnegative().default(60),
    order: z.number().int().nonnegative().default(0),
  })).min(1),
});

export const updateSessionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  duration: z.number().int().positive().optional(),
  caloriesBurned: z.number().int().positive().optional(),
  totalVolume: z.number().positive().optional(),
  status: z.enum(['in_progress', 'completed', 'abandoned']).optional(),
  notes: z.string().optional(),
  exercises: z.array(z.object({
    id: z.number().int().positive(),
    completedSets: z.array(z.object({
      set: z.number().int().positive(),
      reps: z.number().int().nonnegative(),
      weight: z.number().nonnegative().optional(),
      completed: z.boolean(),
    })).optional(),
  })).optional(),
});

export const updateStatsSchema = z.object({
  weeklyGoal: z.number().int().positive().optional(),
  dailyGoalMinutes: z.number().int().positive().optional(),
  dailyGoalCalories: z.number().int().positive().optional(),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type UpdateStatsInput = z.infer<typeof updateStatsSchema>;

export interface WorkoutWithExercises {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  duration: number | null;
  caloriesBurned: number | null;
  difficulty: string;
  isTemplate: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
}

export interface SessionWithExercises {
  id: number;
  userId: number;
  workoutId: number | null;
  name: string;
  startedAt: Date;
  completedAt: Date | null;
  duration: number | null;
  caloriesBurned: number | null;
  totalVolume: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
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
  createdAt: Date;
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
  lastWorkoutDate: Date | null;
  weeklyGoal: number;
  dailyGoalMinutes: number;
  dailyGoalCalories: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: number;
  userId: number;
  type: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  createdAt: Date;
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