'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, Clock, Target } from 'lucide-react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
  label?: string;
  value?: number;
  unit?: string;
  animate?: boolean;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#22c55e',
  bgColor = 'rgba(34, 197, 94, 0.1)',
  showLabel = true,
  label,
  value,
  unit = '',
  animate = true,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const ringStyle = {
    strokeDasharray: circumference,
    strokeDashoffset: animate ? circumference : offset,
    transition: animate ? { duration: 1.5, ease: [0.4, 0, 0.2, 1] } : { duration: 0 },
  } as React.CSSProperties;

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <AnimatePresence mode="wait">
          <motion.circle
            key="bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </AnimatePresence>
        <motion.circle
          key="progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={ringStyle}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {animate ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={Math.round(progress)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {value !== undefined ? (
                  <>
                    <span className="text-3xl font-bold text-dark-900 dark:text-white">
                      {value}{unit}
                    </span>
                    {label && <span className="text-xs text-dark-500 dark:text-dark-400 mt-1">{label}</span>}
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-dark-900 dark:text-white">
                      {Math.round(progress)}%
                    </span>
                    {label && <span className="text-xs text-dark-500 dark:text-dark-400 mt-1">{label}</span>}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              {value !== undefined ? (
                <>
                  <span className="text-3xl font-bold text-dark-900 dark:text-white">
                    {value}{unit}
                  </span>
                  {label && <span className="text-xs text-dark-500 dark:text-dark-400 mt-1">{label}</span>}
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold text-dark-900 dark:text-white">
                    {Math.round(progress)}%
                  </span>
                  {label && <span className="text-xs text-dark-500 dark:text-dark-400 mt-1">{label}</span>}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface StatRingProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  progress: number;
  color: string;
  size?: number;
}

export function StatRing({ icon, value, label, progress, color, size = 80 }: StatRingProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressRing
        progress={progress}
        size={size}
        strokeWidth={6}
        color={color}
        bgColor={`${color}20`}
        value={value}
        label={label}
        animate={true}
      />
    </div>
  );
}

export function ActivityRings({
  move = { progress: 0, value: 0, goal: 600, unit: 'cal' },
  exercise = { progress: 0, value: 0, goal: 30, unit: 'min' },
  stand = { progress: 0, value: 0, goal: 12, unit: 'hrs' },
  size = 140,
}: {
  move?: { progress: number; value: number; goal: number; unit: string };
  exercise?: { progress: number; value: number; goal: number; unit: string };
  stand?: { progress: number; value: number; goal: number; unit: string };
  size?: number;
}) {
  return (
    <div className="flex items-center justify-center gap-6 md:gap-10">
      <StatRing
        icon={<Flame className="w-6 h-6 text-red-500" />}
        value={move.value}
        label="Move"
        progress={Math.min(move.progress, 100)}
        color="#ef4444"
        size={size}
      />
      <StatRing
        icon={<Activity className="w-6 h-6 text-green-500" />}
        value={exercise.value}
        label="Exercise"
        progress={Math.min(exercise.progress, 100)}
        color="#22c55e"
        size={size}
      />
      <StatRing
        icon={<Clock className="w-6 h-6 text-blue-500" />}
        value={stand.value}
        label="Stand"
        progress={Math.min(stand.progress, 100)}
        color="#3b82f6"
        size={size}
      />
    </div>
  );
}

export function CircularProgress({
  progress,
  children,
  size = 60,
  strokeWidth = 4,
  color = '#22c55e',
  bgColor = 'rgba(34, 197, 94, 0.1)',
}: {
  progress: number;
  children: React.ReactNode;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          } as React.CSSProperties}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}