import { useEffect, useCallback } from 'react';
import { useFitnessStore } from '@/store';
import { workoutApi, sessionApi, statsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useWorkouts() {
  const { workouts, setWorkouts, addWorkout, updateWorkout, removeWorkout, setLoading, setError } = useFitnessStore();

  const fetchWorkouts = useCallback(async (params?: { isTemplate?: boolean }) => {
    setLoading(true);
    try {
      const response = await workoutApi.getAll(params);
      if (response.data.success) {
        setWorkouts(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch workouts');
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, [setWorkouts, setLoading, setError]);

  const createWorkout = useCallback(async (data: any) => {
    try {
      const response = await workoutApi.create(data);
      if (response.data.success) {
        addWorkout(response.data.data);
        toast.success('Workout created!');
        return response.data.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create workout');
      throw error;
    }
  }, [addWorkout]);

  const updateWorkoutById = useCallback(async (id: number, data: any) => {
    try {
      const response = await workoutApi.update(id, data);
      if (response.data.success) {
        updateWorkout(response.data.data);
        toast.success('Workout updated!');
        return response.data.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update workout');
      throw error;
    }
  }, [updateWorkout]);

  const deleteWorkoutById = useCallback(async (id: number) => {
    try {
      const response = await workoutApi.delete(id);
      if (response.data.success) {
        removeWorkout(id);
        toast.success('Workout deleted!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete workout');
      throw error;
    }
  }, [removeWorkout]);

  return {
    workouts,
    fetchWorkouts,
    createWorkout,
    updateWorkout: updateWorkoutById,
    deleteWorkout: deleteWorkoutById,
  };
}

export function useSessions() {
  const { sessions, setSessions, addSession, updateSession, setLoading, setError } = useFitnessStore();

  const fetchSessions = useCallback(async (params?: { status?: string }) => {
    setLoading(true);
    try {
      const response = await sessionApi.getAll(params);
      if (response.data.success) {
        setSessions(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [setSessions, setLoading, setError]);

  const createSession = useCallback(async (data: any) => {
    try {
      const response = await sessionApi.create(data);
      if (response.data.success) {
        addSession(response.data.data);
        toast.success('Workout started!');
        return response.data.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start workout');
      throw error;
    }
  }, [addSession]);

  const updateSessionById = useCallback(async (id: number, data: any) => {
    try {
      const response = await sessionApi.update(id, data);
      if (response.data.success) {
        updateSession(response.data.data);
        return response.data.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update session');
      throw error;
    }
  }, [updateSession]);

  const completeSession = useCallback(async (id: number, data?: any) => {
    try {
      const response = await sessionApi.complete(id, data);
      if (response.data.success) {
        updateSession(response.data.data);
        toast.success('Workout completed! 🎉');
        return response.data.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete workout');
      throw error;
    }
  }, [updateSession]);

  return {
    sessions,
    fetchSessions,
    createSession,
    updateSession: updateSessionById,
    completeSession,
  };
}

export function useStats() {
  const { stats, weeklyProgress, setStats, setWeeklyProgress, setLoading, setError } = useFitnessStore();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await statsApi.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [setStats, setLoading, setError]);

  const fetchProgress = useCallback(async (weeks = 4) => {
    try {
      const response = await statsApi.getProgress(weeks);
      if (response.data.success) {
        setWeeklyProgress(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch progress');
    }
  }, [setWeeklyProgress, setError]);

  const updateGoals = useCallback(async (data: any) => {
    try {
      const response = await statsApi.updateGoals(data);
      if (response.data.success) {
        setStats(response.data.data);
        toast.success('Goals updated!');
        return response.data.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update goals');
      throw error;
    }
  }, [setStats]);

  return {
    stats,
    weeklyProgress,
    fetchStats,
    fetchProgress,
    updateGoals,
  };
}