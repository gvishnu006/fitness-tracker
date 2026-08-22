import { db } from '../db';
import { userStats, workoutSessions } from '../db/schema';
import { eq, and, gte, lte, desc, count, sql } from 'drizzle-orm';
import { subDays, startOfDay, endOfDay, differenceInDays, isSameDay } from 'date-fns';

export async function calculateStreak(userId: number): Promise<{ currentStreak: number; longestStreak: number }> {
  const sessions = await db
    .select({ completedAt: workoutSessions.completedAt })
    .from(workoutSessions)
    .where(
      and(
        eq(workoutSessions.userId, userId),
        eq(workoutSessions.status, 'completed')
      )
    )
    .orderBy(desc(workoutSessions.completedAt));

  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const workoutDates = sessions
    .map(s => startOfDay(s.completedAt!))
    .filter((date): date is Date => date !== null);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  if (isSameDay(workoutDates[0], today) || isSameDay(workoutDates[0], yesterday)) {
    currentStreak = 1;
    for (let i = 1; i < workoutDates.length; i++) {
      const diff = differenceInDays(workoutDates[i - 1], workoutDates[i]);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  for (let i = 1; i < workoutDates.length; i++) {
    const diff = differenceInDays(workoutDates[i - 1], workoutDates[i]);
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
}

export async function updateUserStats(userId: number) {
  const { currentStreak, longestStreak } = await calculateStreak(userId);

  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  const completedSessions = await db
    .select({
      duration: workoutSessions.duration,
      caloriesBurned: workoutSessions.caloriesBurned,
      totalVolume: workoutSessions.totalVolume,
    })
    .from(workoutSessions)
    .where(
      and(
        eq(workoutSessions.userId, userId),
        eq(workoutSessions.status, 'completed')
      )
    );

  const totalWorkouts = completedSessions.length;
  const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalCalories = completedSessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);
  const lastWorkout = completedSessions[0]?.completedAt || null;

  if (stats.length > 0) {
    await db
      .update(userStats)
      .set({
        currentStreak,
        longestStreak: Math.max(longestStreak, stats[0].longestStreak),
        totalWorkouts,
        totalDuration,
        totalCalories,
        lastWorkoutDate: lastWorkout ? startOfDay(lastWorkout) : null,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId));
  } else {
    await db.insert(userStats).values({
      userId,
      currentStreak,
      longestStreak,
      totalWorkouts,
      totalDuration,
      totalCalories,
      lastWorkoutDate: lastWorkout ? startOfDay(lastWorkout) : null,
    });
  }

  return { currentStreak, longestStreak, totalWorkouts, totalDuration, totalCalories };
}

export async function checkAchievements(userId: number) {
  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  if (stats.length === 0) return [];

  const existingAchievements = await db
    .select({ type: achievements.type })
    .from(achievements)
    .where(eq(achievements.userId, userId));

  const earnedTypes = new Set(existingAchievements.map(a => a.type));
  const newAchievements = [];

  const achievementDefinitions = [
    { type: 'first_workout', name: 'First Steps', description: 'Complete your first workout', icon: '🎯', condition: stats[0].totalWorkouts >= 1 },
    { type: 'workouts_10', name: 'Getting Started', description: 'Complete 10 workouts', icon: '💪', condition: stats[0].totalWorkouts >= 10 },
    { type: 'workouts_50', name: 'Consistent', description: 'Complete 50 workouts', icon: '🔥', condition: stats[0].totalWorkouts >= 50 },
    { type: 'workouts_100', name: 'Centurion', description: 'Complete 100 workouts', icon: '💯', condition: stats[0].totalWorkouts >= 100 },
    { type: 'streak_7', name: 'Week Warrior', description: '7 day workout streak', icon: '📅', condition: stats[0].currentStreak >= 7 },
    { type: 'streak_30', name: 'Monthly Master', description: '30 day workout streak', icon: '🗓️', condition: stats[0].currentStreak >= 30 },
    { type: 'streak_100', name: 'Streak Legend', description: '100 day workout streak', icon: '🏆', condition: stats[0].currentStreak >= 100 },
    { type: 'hours_50', name: 'Iron Will', description: '50 hours of training', icon: '⏱️', condition: stats[0].totalDuration >= 3000 },
    { type: 'calories_10k', name: 'Calorie Crusher', description: 'Burn 10,000 calories', icon: '🔥', condition: stats[0].totalCalories >= 10000 },
  ];

  for (const ach of achievementDefinitions) {
    if (ach.condition && !earnedTypes.has(ach.type)) {
      await db.insert(achievements).values({
        userId,
        type: ach.type,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
      });
      newAchievements.push(ach);
    }
  }

  return newAchievements;
}

import { achievements } from '../db/schema';