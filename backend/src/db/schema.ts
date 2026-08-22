import { pgTable, serial, varchar, integer, timestamp, boolean, jsonb, text, date, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  duration: integer('duration'), // in minutes
  caloriesBurned: integer('calories_burned'),
  difficulty: varchar('difficulty', { length: 20 }).default('beginner'), // beginner, intermediate, advanced
  isTemplate: boolean('is_template').default(false),
  tags: jsonb('tags').default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').references(() => workouts.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  sets: integer('sets').default(3),
  reps: integer('reps').default(10),
  weight: decimal('weight', { precision: 6, scale: 2 }),
  duration: integer('duration'), // in seconds for timed exercises
  restTime: integer('rest_time').default(60), // in seconds
  order: integer('order').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workoutSessions = pgTable('workout_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  workoutId: integer('workout_id').references(() => workouts.id),
  name: varchar('name', { length: 200 }).notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'), // in minutes
  caloriesBurned: integer('calories_burned'),
  totalVolume: decimal('total_volume', { precision: 10, scale: 2 }), // total weight lifted
  status: varchar('status', { length: 20 }).default('in_progress'), // in_progress, completed, abandoned
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessionExercises = pgTable('session_exercises', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => workoutSessions.id, { onDelete: 'cascade' }).notNull(),
  exerciseId: integer('exercise_id').references(() => exercises.id),
  name: varchar('name', { length: 200 }).notNull(),
  sets: integer('sets').default(3),
  reps: integer('reps').default(10),
  weight: decimal('weight', { precision: 6, scale: 2 }),
  duration: integer('duration'),
  restTime: integer('rest_time').default(60),
  order: integer('order').default(0),
  completedSets: jsonb('completed_sets').default([]), // [{ set: 1, reps: 10, weight: 50, completed: true }]
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userStats = pgTable('user_stats', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  totalWorkouts: integer('total_workouts').default(0),
  totalDuration: integer('total_duration').default(0), // in minutes
  totalCalories: integer('total_calories').default(0),
  lastWorkoutDate: date('last_workout_date'),
  weeklyGoal: integer('weekly_goal').default(5),
  dailyGoalMinutes: integer('daily_goal_minutes').default(30),
  dailyGoalCalories: integer('daily_goal_calories').default(300),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // streak_7, streak_30, workouts_10, workouts_100, etc.
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  workouts: many(workouts),
  sessions: many(workoutSessions),
  stats: one(userStats),
  achievements: many(achievements),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, { fields: [workouts.userId], references: [users.id] }),
  exercises: many(exercises),
  sessions: many(workoutSessions),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  workout: one(workouts, { fields: [exercises.workoutId], references: [workouts.id] }),
  sessionExercises: many(sessionExercises),
}));

export const workoutSessionsRelations = relations(workoutSessions, ({ one, many }) => ({
  user: one(users, { fields: [workoutSessions.userId], references: [users.id] }),
  workout: one(workouts, { fields: [workoutSessions.workoutId], references: [workouts.id] }),
  sessionExercises: many(sessionExercises),
}));

export const sessionExercisesRelations = relations(sessionExercises, ({ one }) => ({
  session: one(workoutSessions, { fields: [sessionExercises.sessionId], references: [workoutSessions.id] }),
  exercise: one(exercises, { fields: [sessionExercises.exerciseId], references: [exercises.id] }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, { fields: [userStats.userId], references: [users.id] }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, { fields: [achievements.userId], references: [users.id] }),
}));