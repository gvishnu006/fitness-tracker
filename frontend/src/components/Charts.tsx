'use client';

import { useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyProgressData {
  date: string;
  workouts: number;
  duration: number;
  calories: number;
  volume: number;
}

interface ChartProps {
  data: WeeklyProgressData[];
  metric: 'workouts' | 'duration' | 'calories' | 'volume';
  height?: number;
}

const metricConfig = {
  workouts: { label: 'Workouts', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' },
  duration: { label: 'Duration (min)', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  calories: { label: 'Calories', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  volume: { label: 'Volume (kg)', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export function WeeklyBarChart({ data, metric, height = 250 }: ChartProps) {
  const config = metricConfig[metric];
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const chartData = useMemo(() => ({
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: config.label,
        data: data.map(d => d[metric]),
        backgroundColor: config.bgColor,
        borderColor: config.color,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 40,
      },
    ],
  }), [data, metric, config]);

  const options: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} ${metric === 'workouts' ? '' : metric === 'duration' ? 'min' : metric === 'calories' ? 'cal' : 'kg'}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  }), [metric, config]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ height }}
    >
      <Bar data={chartData} options={options} ref={chartRef as any} />
    </motion.div>
  );
}

export function WeeklyLineChart({ data, metric, height = 250 }: ChartProps) {
  const config = metricConfig[metric];
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData = useMemo(() => ({
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: config.label,
        data: data.map(d => d[metric]),
        borderColor: config.color,
        backgroundColor: config.bgColor,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: config.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }), [data, metric, config]);

  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} ${metric === 'workouts' ? '' : metric === 'duration' ? 'min' : metric === 'calories' ? 'cal' : 'kg'}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true,
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  }), [metric, config]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
      style={{ height }}
    >
      <Line data={chartData} options={options} ref={chartRef as any} />
    </motion.div>
  );
}

export function WeeklyDoughnutChart({ data, metric, height = 200 }: ChartProps) {
  const config = metricConfig[metric];
  
  const total = data.reduce((sum, d) => sum + d[metric], 0);
  const avg = data.length > 0 ? total / data.length : 0;

  const chartData = useMemo(() => ({
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        data: data.map(d => d[metric]),
        backgroundColor: data.map((_, i) => {
          const opacity = 0.3 + (i / data.length) * 0.7;
          return config.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
        }),
        borderWidth: 0,
        spacing: 2,
      },
    ],
  }), [data, metric, config]);

  const options: ChartOptions<'doughnut'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed} ${metric === 'workouts' ? '' : metric === 'duration' ? 'min' : metric === 'calories' ? 'cal' : 'kg'}`,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutQuart',
    },
  }), [metric, config]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full"
      style={{ height }}
    >
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-dark-900 dark:text-white">{Math.round(total)}</span>
        <span className="text-xs text-dark-500 dark:text-dark-400 mt-1">Total {config.label}</span>
      </div>
    </motion.div>
  );
}

export function ProgressChart({
  data,
  metric = 'workouts',
  type = 'bar',
  height = 250,
}: ChartProps & { type?: 'bar' | 'line' | 'doughnut' }) {
  switch (type) {
    case 'line':
      return <WeeklyLineChart data={data} metric={metric} height={height} />;
    case 'doughnut':
      return <WeeklyDoughnutChart data={data} metric={metric} height={height} />;
    default:
      return <WeeklyBarChart data={data} metric={metric} height={height} />;
  }
}

export function MultiMetricChart({ data, height = 300 }: { data: WeeklyProgressData[]; height?: number }) {
  const chartData = useMemo(() => ({
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Workouts',
        data: data.map(d => d.workouts),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Duration (min)',
        data: data.map(d => d.duration),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Calories',
        data: data.map(d => d.calories),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  }), [data]);

  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#64748b', font: { size: 11 }, usePointStyle: true, padding: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        type: 'linear',
        position: 'left',
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true,
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
    animation: { duration: 1000, easing: 'easeOutQuart' },
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ height }}
    >
      <Line data={chartData} options={options} />
    </motion.div>
  );
}