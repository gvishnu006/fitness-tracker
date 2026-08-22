import { db } from '../db';
import { workouts, exercises, workoutSessions, sessionExercises } from '../db/schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { updateUserStats, checkAchievements } from './streak';

export async function createWorkout(userId: number, data: {
  name: string;
  description?: string;
  duration?: number;
  caloriesBurned?: number;
  difficulty?: string;
  isTemplate?: boolean;
  tags?: string[];
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime?: number;
    order: number;
    notes?: string;
  }>;
}) {
  const [workout] = await db.insert(workouts).values({
    userId,
    name: data.name,
    description: data.description,
    duration: data.duration,
    caloriesBurned: data.caloriesBurned,
    difficulty: data.difficulty || 'beginner',
    isTemplate: data.isTemplate || false,
    tags: data.tags || [],
  }).returning();

  if (data.exercises.length > 0) {
    await db.insert(exercises).values(
      data.exercises.map((ex, index) => ({
        workoutId: workout.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight?.toString(),
        duration: ex.duration,
        restTime: ex.restTime || 60,
        order: ex.order ?? index,
        notes: ex.notes,
      }))
    );
  }

  return getWorkoutById(workout.id);
}

export async function getWorkouts(userId: number, options?: { isTemplate?: boolean; limit?: number; offset?: number }) {
  const conditions = [eq(workouts.userId, userId)];
  if (options?.isTemplate !== undefined) {
    conditions.push(eq(workouts.isTemplate, options.isTemplate));
  }

  return db
    .select()
    .from(workouts)
    .where(and(...conditions))
    .orderBy(desc(workouts.updatedAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);
}

export async function getWorkoutById(id: number) {
  const workout = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, id))
    .limit(1);

  if (workout.length === 0) return null;

  const workoutExercises = await db
    .select()
    .from(exercises)
    .where(eq(exercises.workoutId, id))
    .orderBy(asc(exercises.order));

  return { ...workout[0], exercises: workoutExercises };
}

export async function updateWorkout(id: number, userId: number, data: Partial<{
  name: string;
  description: string;
  duration: number;
  caloriesBurned: number;
  difficulty: string;
  isTemplate: boolean;
  tags: string[];
  exercises: Array<{
    id?: number;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime: number;
    order: number;
    notes?: string;
  }>;
}>) {
  const existing = await db.select().from(workouts).where(and(eq(workouts.id, id), eq(workouts.userId, userId))).limit(1);
  if (existing.length === 0) return null;

  await db
    .update(workouts)
    .set({
      ...data,
      tags: data.tags,
      updatedAt: new Date(),
    })
    .where(eq(workouts.id, id));

  if (data.exercises) {
    await db.delete(exercises).where(eq(exercises.workoutId, id));
    if (data.exercises.length > 0) {
      await db.insert(exercises).values(
        data.exercises.map((ex, index) => ({
          workoutId: id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight?.toString(),
          duration: ex.duration,
          restTime: ex.restTime || 60,
          order: ex.order ?? index,
          notes: ex.notes,
        }))
      );
    }
  }

  return getWorkoutById(id);
}

export async function deleteWorkout(id: number, userId: number) {
  const existing = await db.select().from(workouts).where(and(eq(workouts.id, id), eq(workouts.userId, userId))).limit(1);
  if (existing.length === 0) return false;

  await db.delete(workouts).where(eq(workouts.id, id));
  return true;
}

export async function createSession(userId: number, data: {
  workoutId?: number;
  name: string;
  exercises: Array<{
    exerciseId?: number;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime: number;
    order: number;
  }>;
}) {
  const [session] = await db.insert(workoutSessions).values({
    userId,
    workoutId: data.workoutId,
    name: data.name,
    status: 'in_progress',
  }).returning();

  if (data.exercises.length > 0) {
    await db.insert(sessionExercises).values(
      data.exercises.map((ex, index) => ({
        sessionId: session.id,
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight?.toString(),
        duration: ex.duration,
        restTime: ex.restTime,
        order: ex.order ?? index,
        completedSets: [],
      }))
    );
  }

  return getSessionById(session.id);
}

export async function getSessions(userId: number, options?: { limit?: number; offset?: number; status?: string }) {
  const conditions = [eq(workoutSessions.userId, userId)];
  if (options?.status) {
    conditions.push(eq(workoutSessions.status, options.status));
  }

  return db
    .select()
    .from(workoutSessions)
    .where(and(...conditions))
    .orderBy(desc(workoutSessions.startedAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);
}

export async function getSessionById(id: number) {
  const session = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.id, id))
    .limit(1);

  if (session.length === 0) return null;

  const sessionExs = await db
    .select()
    .from(sessionExercises)
    .where(eq(sessionExercises.sessionId, id))
    .orderBy(asc(sessionExercises.order));

  return { ...session[0], sessionExercises: sessionExs };
}

export async function updateSession(id: number, userId: number, data: Partial<{
  name: string;
  duration: number;
  caloriesBurned: number;
  totalVolume: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  notes: string;
  exercises: Array<{
    id: number;
    completedSets: Array<{ set: number; reps: number; weight?: number; completed: boolean }>;
  }>;
}>) {
  const existing = await db.select().from(workoutSessions).where(and(eq(workoutSessions.id, id), eq(workoutSessions.userId, userId))).limit(1);
  if (existing.length === 0) return null;

  const wasCompleted = existing[0].status === 'completed';
  const willBeCompleted = data.status === 'completed';

  await db
    .update(workoutSessions)
    .set({
      ...data,
      totalVolume: data.totalVolume?.toString(),
    })
    .where(eq(workoutSessions.id, id));

  if (data.exercises) {
    for (const ex of data.exercises) {
      await db
        .update(sessionExercises)
        .set({ completedSets: ex.completedSets })
        .where(and(eq(sessionExercises.id, ex.id), eq(sessionExercises.sessionId, id)));
    }
  }

  if (!wasCompleted && willBeCompleted) {
    await updateUserStats(userId);
    await checkAchievements(userId);
  }

  return getSessionById(id);
}

export async function getWeeklyProgress(userId: number, weeks: number = 4) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);
  startDate.setHours(0, 0, 0, 0);

  const sessions = await db
    .select({
      completedAt: workoutSessions.completedAt,
      duration: workoutSessions.duration,
      caloriesBurned: workoutSessions.caloriesBurned,
      totalVolume: workoutSessions.totalVolume,
    })
    .from(workoutSessions)
    .where(
      and(
        eq(workoutSessions.userId, userId),
        eq(workoutSessions.status, 'completed'),
        gte(workoutSessions.completedAt, startDate)
      )
    )
    .orderBy(asc(workoutSessions.completedAt));

  const dailyData = new Map<string, { workouts: number; duration: number; calories: number; volume: number }>();

  for (let i = 0; i < weeks * 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().split('T')[0];
    dailyData.set(key, { workouts: 0, duration: 0, calories: 0, volume: 0 });
  }

  sessions.forEach(s => {
    if (!s.completedAt) return;
    const key = s.completedAt.toISOString().split('T')[0];
    const existing = dailyData.get(key) || { workouts: 0, duration: 0, calories: 0, volume: 0 };
    existing.workouts += 1;
    existing.duration += s.duration || 0;
    existing.calories += s.caloriesBurned || 0;
    existing.volume += parseFloat(s.totalVolume || '0');
    dailyData.set(key, existing);
  });

  return Array.from(dailyData.entries()).map(([date, data]) => ({ date, ...data }));
}

export async function getUserStats(userId: number) {
  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  if (stats.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      lastWorkoutDate: null,
      weeklyGoal: 5,
      dailyGoalMinutes: 30,
      dailyGoalCalories: 300,
    };
  }

  const ach = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId))
    .orderBy(desc(achievements.earnedAt));

  return { ...stats[0], achievements: ach };
}

export async function updateUserGoals(userId: number, data: { weeklyGoal?: number; dailyGoalMinutes?: number; dailyGoalCalories?: number }) {
  const existing = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
  if (existing.length === 0) {
    await db.insert(userStats).values({ userId, ...data });
  } else {
    await db.update(userStats).set({ ...data, updatedAt: new Date() }).where(eq(userStats.userId, userId));
  }
  return getUserStats(userId);
}

import { userStats, achievements } from '../db/schema';
import { gte, asc } from 'drizzle-orm';