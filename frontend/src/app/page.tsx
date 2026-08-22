'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Dumbbell, Calendar, Clock, Flame, Trophy, Menu, X, ChevronDown, Play, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useWorkouts, useSessions, useStats } from '@/hooks/useWorkouts';
import { DashboardStats } from '@/components/DashboardStats';
import { WorkoutBuilder, ExerciseSelector } from '@/components/WorkoutBuilder';
import { ProgressRing } from '@/components/ProgressRing';
import { WeeklyProgressData, Workout, Session } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { workouts, fetchWorkouts, createWorkout, deleteWorkout } = useWorkouts();
  const { sessions, fetchSessions, createSession, completeSession } = useSessions();
  const { stats, weeklyProgress, fetchStats, fetchProgress } = useStats();

  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [showSessionDetail, setShowSessionDetail] = useState<Session | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'workouts' | 'duration' | 'calories' | 'volume'>('workouts');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'doughnut'>('bar');

  useEffect(() => {
    fetchWorkouts();
    fetchSessions();
    fetchStats();
    fetchProgress(4);
  }, [fetchWorkouts, fetchSessions, fetchStats, fetchProgress]);

  const todaySessions = sessions.filter(s => {
    const today = new Date();
    const sessionDate = new Date(s.startedAt);
    return format(sessionDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  });

  const thisWeekWorkouts = weeklyProgress.reduce((sum, d) => sum + d.workouts, 0);

  const handleSaveWorkout = async (exercises: any[]) => {
    try {
      await createWorkout({
        name: `Workout ${format(new Date(), 'MMM d')}`,
        exercises: exercises.map((ex, i) => ({ ...ex, order: i })),
      });
      setShowBuilder(false);
      setEditingWorkout(null);
    } catch (error) {
      console.error('Failed to save workout:', error);
    }
  };

  const handleStartWorkout = async (workout: Workout) => {
    try {
      const session = await createSession({
        workoutId: workout.id,
        name: workout.name,
        exercises: workout.exercises.map((ex, i) => ({
          exerciseId: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight ? parseFloat(ex.weight) : undefined,
          duration: ex.duration,
          restTime: ex.restTime,
          order: i,
        })),
      });
      setActiveSession(session);
    } catch (error) {
      toast.error('Failed to start workout');
    }
  };

  const handleQuickStart = async () => {
    try {
      const session = await createSession({
        name: `Quick Workout ${format(new Date(), 'HH:mm')}`,
        exercises: [{ name: 'Custom Exercise', sets: 3, reps: 10, restTime: 60, order: 0 }],
      });
      setActiveSession(session);
    } catch (error) {
      toast.error('Failed to start workout');
    }
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <header className="sticky top-0 z-40 glass border-b border-dark-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                className="p-2 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl"
              >
                <Dumbbell className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-dark-900 dark:text-white">FitTracker</h1>
                <p className="text-xs text-dark-500 dark:text-dark-400">Your fitness companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-primary" onClick={() => setShowBuilder(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Workout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {showBuilder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              onClick={() => setShowBuilder(false)}
            >
              <WorkoutBuilder
                initialExercises={editingWorkout?.exercises}
                workoutName={editingWorkout?.name}
                onNameChange={(name) => {}}
                onSave={handleSaveWorkout}
                onCancel={() => { setShowBuilder(false); setEditingWorkout(null); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setActiveSession(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-dark-200 dark:border-dark-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{activeSession.name}</h3>
                  <button onClick={() => setActiveSession(null)} className="p-2 text-dark-400 hover:text-dark-600 rounded-lg hover:bg-dark-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {activeSession.sessionExercises.map((ex, i) => (
                    <div key={ex.id} className="mb-4 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                      <h4 className="font-medium text-dark-900 dark:text-white mb-2">{ex.name}</h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-white dark:bg-dark-700 rounded-lg">
                          <p className="text-xs text-dark-500">Sets</p>
                          <p className="font-bold text-dark-900 dark:text-white">{ex.sets}</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-dark-700 rounded-lg">
                          <p className="text-xs text-dark-500">Reps</p>
                          <p className="font-bold text-dark-900 dark:text-white">{ex.reps}</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-dark-700 rounded-lg">
                          <p className="text-xs text-dark-500">Rest</p>
                          <p className="font-bold text-dark-900 dark:text-white">{ex.restTime}s</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-dark-200 dark:border-dark-700 flex gap-3">
                  <button
                    onClick={() => completeSession(activeSession.id, { duration: 30, caloriesBurned: 250 })}
                    className="flex-1 btn-primary"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </button>
                  <button
                    onClick={() => setActiveSession(null)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <DashboardStats stats={stats} weeklyProgress={weeklyProgress} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white">Your Workouts</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-dark-500 dark:text-dark-400">{workouts.length} workouts</span>
            </div>
          </div>

          {workouts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-4"
              >
                <Dumbbell className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">No workouts yet</h3>
              <p className="text-dark-500 dark:text-dark-400 mb-6">Create your first workout to get started</p>
              <button onClick={() => setShowBuilder(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Workout
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  className="card p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                        <Dumbbell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-dark-900 dark:text-white truncate">{workout.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-dark-500 dark:text-dark-400">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" />
                            {workout.caloriesBurned || workout.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * (ex.weight ? parseFloat(ex.weight) : 0) * 0.1), 0)} kcal
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {workout.duration || workout.exercises.reduce((sum, ex) => sum + ex.sets * (ex.restTime + 30), 0)} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            {workout.exercises.length} exercises
                          </span>
                          <span className={`badge ${workout.difficulty === 'beginner' ? 'badge-success' : workout.difficulty === 'intermediate' ? 'badge-warning' : 'badge-danger'}`}>
                            {workout.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartWorkout(workout)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </button>
                      <button
                        onClick={() => { setEditingWorkout(workout); setShowBuilder(true); }}
                        className="p-2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="p-2 text-dark-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dark-200 dark:border-dark-700">
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises.slice(0, 4).map((ex) => (
                        <span key={ex.id} className="px-2 py-1 bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 text-xs rounded-full">
                          {ex.name} {ex.sets}×{ex.reps}
                        </span>
                      ))}
                      {workout.exercises.length > 4 && (
                        <span className="px-2 py-1 bg-dark-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400 text-xs rounded-full">
                          +{workout.exercises.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        onClick={handleQuickStart}
        className="fixed bottom-6 right-6 z-40 btn-primary shadow-xl shadow-primary-500/40 p-4 rounded-2xl"
        aria-label="Quick start workout"
      >
        <Play className="w-6 h-6" />
      </motion.button>
    </div>
  );
}