import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workout {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  duration: number | null;
  caloriesBurned: number | null;
  difficulty: string;
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
  status: string;
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

interface FitnessState {
  workouts: Workout[];
  sessions: Session[];
  stats: UserStats | null;
  weeklyProgress: WeeklyProgress[];
  isLoading: boolean;
  error: string | null;
  
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  removeWorkout: (id: number) => void;
  
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (session: Session) => void;
  
  setStats: (stats: UserStats) => void;
  setWeeklyProgress: (progress: WeeklyProgress[]) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set) => ({
      workouts: [],
      sessions: [],
      stats: null,
      weeklyProgress: [],
      isLoading: false,
      error: null,
      
      setWorkouts: (workouts) => set({ workouts }),
      addWorkout: (workout) => set((state) => ({ workouts: [workout, ...state.workouts] })),
      updateWorkout: (workout) => set((state) => ({
        workouts: state.workouts.map((w) => (w.id === workout.id ? workout : w)),
      })),
      removeWorkout: (id) => set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id),
      })),
      
      setSessions: (sessions) => set({ sessions }),
      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      updateSession: (session) => set((state) => ({
        sessions: state.sessions.map((s) => (s.id === session.id ? session : s)),
      })),
      
      setStats: (stats) => set({ stats }),
      setWeeklyProgress: (progress) => set({ weeklyProgress: progress }),
      
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'fitness-store',
      partialize: (state) => ({
        workouts: state.workouts,
        sessions: state.sessions,
        stats: state.stats,
        weeklyProgress: state.weeklyProgress,
      }),
    }
  )
);