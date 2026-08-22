'use client';

import { motion } from 'framer-motion';
import { Activity, Flame, Clock, Target, Trophy, Zap, Dumbbell, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { ActivityRings, ProgressRing, CircularProgress } from '@/components/ProgressRing';
import { WeeklyBarChart, WeeklyLineChart, MultiMetricChart } from '@/components/Charts';
import { WeeklyProgress, UserStats } from '@/types';

interface DashboardStatsProps {
  stats: UserStats | null;
  weeklyProgress: WeeklyProgress[];
}

export function DashboardStats({ stats, weeklyProgress }: DashboardStatsProps) {
  const todayProgress = weeklyProgress[weeklyProgress.length - 1] || { workouts: 0, duration: 0, calories: 0, volume: 0 };
  const weeklyWorkouts = weeklyProgress.reduce((sum, d) => sum + d.workouts, 0);
  const weeklyDuration = weeklyProgress.reduce((sum, d) => sum + d.duration, 0);
  const weeklyCalories = weeklyProgress.reduce((sum, d) => sum + d.calories, 0);

  const moveProgress = stats?.dailyGoalCalories ? Math.min((todayProgress.calories / stats.dailyGoalCalories) * 100, 100) : 0;
  const exerciseProgress = stats?.dailyGoalMinutes ? Math.min((todayProgress.duration / stats.dailyGoalMinutes) * 100, 100) : 0;
  const standProgress = 50; // Placeholder - would need stand hours tracking

  const statCards = [
    { icon: Flame, label: 'Calories', value: todayProgress.calories, unit: 'kcal', goal: stats?.dailyGoalCalories || 300, progress: moveProgress, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { icon: Activity, label: 'Exercise', value: todayProgress.duration, unit: 'min', goal: stats?.dailyGoalMinutes || 30, progress: exerciseProgress, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { icon: Clock, label: 'Stand Hours', value: Math.floor(standProgress / 100 * 12), unit: 'hrs', goal: 12, progress: standProgress, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { icon: Target, label: 'Weekly Goal', value: weeklyWorkouts, unit: '/wk', goal: stats?.weeklyGoal || 5, progress: Math.min((weeklyWorkouts / (stats?.weeklyGoal || 5)) * 100, 100), color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            className={`card p-4 relative overflow-hidden ${stat.bgColor} dark:${stat.bgColor.replace('500', '900/30')}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-dark-900 dark:text-white">{stat.value}</span>
                  <span className="text-sm text-dark-500 dark:text-dark-400">{stat.unit}</span>
                </div>
                <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">Goal: {stat.goal}{stat.unit}</p>
              </div>
              <CircularProgress
                progress={stat.progress}
                size={56}
                strokeWidth={5}
                color={stat.color.replace('text-', '')}
                bgColor={stat.bgColor.replace('bg-', '').replace('/10', '') + '20'}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </CircularProgress>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        ))}
      </div>

      <ActivityRings
        move={{ progress: moveProgress, value: todayProgress.calories, goal: stats?.dailyGoalCalories || 300, unit: 'kcal' }}
        exercise={{ progress: exerciseProgress, value: todayProgress.duration, goal: stats?.dailyGoalMinutes || 30, unit: 'min' }}
        stand={{ progress: standProgress, value: Math.floor(standProgress / 100 * 12), goal: 12, unit: 'hrs' }}
        size={160}
      />

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon={Calendar}
            value={stats.currentStreak}
            label="Current Streak"
            subtitle={`${stats.longestStreak} days best`}
            color="text-orange-500"
            bgColor="bg-orange-500/10"
          />
          <StatCard
            icon={Trophy}
            value={stats.totalWorkouts}
            label="Total Workouts"
            subtitle={`${stats.totalDuration} min total`}
            color="text-yellow-500"
            bgColor="bg-yellow-500/10"
          />
          <StatCard
            icon={TrendingUp}
            value={stats.totalCalories.toLocaleString()}
            label="Calories Burned"
            subtitle={`${Math.round(stats.totalCalories / Math.max(stats.totalWorkouts, 1))} avg/workout`}
            color="text-red-500"
            bgColor="bg-red-500/10"
          />
          <StatCard
            icon={Zap}
            value={`${Math.round((stats.currentStreak / Math.max(stats.weeklyGoal * 4, 1)) * 100)}%`}
            label="Monthly Progress"
            subtitle={`${stats.currentStreak}/${stats.weeklyGoal * 4} days`}
            color="text-purple-500"
            bgColor="bg-purple-500/10"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Weekly Progress</h3>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="workouts">Workouts</option>
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="volume">Volume</option>
            </select>
            <select className="px-3 py-1.5 bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg text-sm text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="bar">Bars</option>
              <option value="line">Line</option>
              <option value="doughnut">Doughnut</option>
            </select>
          </div>
        </div>
        <WeeklyBarChart data={weeklyProgress} metric="workouts" height={280} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Multi-Metric Overview</h3>
          <MultiMetricChart data={weeklyProgress} height={280} />
        </div>
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Calories Trend</h3>
          <WeeklyLineChart data={weeklyProgress} metric="calories" height={280} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, value, label, subtitle, color, bgColor }: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  subtitle: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`card p-4 ${bgColor} dark:${bgColor.replace('500', '900/30')}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-500 dark:text-dark-400">{label}</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white mt-1">{value}</p>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor} dark:${bgColor.replace('500', '900/30')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}