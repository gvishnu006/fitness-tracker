'use client';

import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Trash2, Plus, Minus, Dumbbell, Timer, Zap, X } from 'lucide-react';
import { Exercise } from '@/types';

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  onUpdate: (exercise: Exercise) => void;
  onRemove: () => void;
  isDragging: boolean;
}

function ExerciseItem({ exercise, index, onUpdate, onRemove, isDragging }: ExerciseItemProps) {
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [weight, setWeight] = useState<string>(exercise.weight || '');
  const [duration, setDuration] = useState<string>(exercise.duration ? String(exercise.duration) : '');
  const [restTime, setRestTime] = useState(exercise.restTime);

  const handleChange = () => {
    onUpdate({
      ...exercise,
      sets,
      reps,
      weight: weight ? parseFloat(weight).toString() : null,
      duration: duration ? parseInt(duration, 10) : null,
      restTime,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white dark:bg-dark-800 rounded-xl p-4 border border-dark-200 dark:border-dark-700 transition-all duration-200 ${
        isDragging ? 'shadow-lg rotate-1 scale-102 z-50 bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex flex-col gap-1 mt-1 text-dark-400 cursor-grab active:cursor-grabbing text-xl"
          role="button"
          tabIndex={0}
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => onUpdate({ ...exercise, name: e.target.value })}
              className="flex-1 bg-transparent border-none text-lg font-semibold text-dark-900 dark:text-white focus:outline-none placeholder-dark-400"
              placeholder="Exercise name"
            />
            <button
              onClick={onRemove}
              className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Remove exercise"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-dark-500 dark:text-dark-400 mb-1">Sets</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const v = Math.max(1, sets - 1); setSets(v); handleChange(); }}
                  className="w-8 h-8 rounded-lg bg-dark-100 dark:bg-dark-700 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-dark-900 dark:text-white">{sets}</span>
                <button
                  onClick={() => { const v = sets + 1; setSets(v); handleChange(); }}
                  className="w-8 h-8 rounded-lg bg-dark-100 dark:bg-dark-700 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-500 dark:text-dark-400 mb-1">Reps</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const v = Math.max(1, reps - 1); setReps(v); handleChange(); }}
                  className="w-8 h-8 rounded-lg bg-dark-100 dark:bg-dark-700 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-dark-900 dark:text-white">{reps}</span>
                <button
                  onClick={() => { const v = reps + 1; setReps(v); handleChange(); }}
                  className="w-8 h-8 rounded-lg bg-dark-100 dark:bg-dark-700 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-500 dark:text-dark-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={weight}
                onChange={(e) => { setWeight(e.target.value); handleChange(); }}
                className="w-full px-3 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg text-dark-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-xs text-dark-500 dark:text-dark-400 mb-1">Rest (sec)</label>
              <input
                type="number"
                min="0"
                value={restTime}
                onChange={(e) => { const v = parseInt(e.target.value) || 0; setRestTime(v); handleChange(); }}
                className="w-full px-3 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg text-dark-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {exercise.duration && (
            <div className="mt-3 pt-3 border-t border-dark-200 dark:border-dark-700">
              <label className="block text-xs text-dark-500 dark:text-dark-400 mb-1">Duration (seconds)</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => { setDuration(e.target.value); handleChange(); }}
                className="w-full px-3 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg text-dark-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute inset-0 bg-primary-500/10 rounded-xl pointer-events-none"
        style={{ opacity: isDragging ? 1 : 0, transform: isDragging ? 'scale(1.02)' : 'scale(1)' }}
      />
    </motion.div>
  );
}

interface WorkoutBuilderProps {
  initialExercises?: Exercise[];
  onSave: (exercises: Exercise[]) => void;
  onCancel: () => void;
  workoutName?: string;
  onNameChange?: (name: string) => void;
}

export function WorkoutBuilder({ initialExercises = [], onSave, onCancel, workoutName, onNameChange }: WorkoutBuilderProps) {
  const [exercises, setExercises] = useState<Exercise[]>(
    initialExercises.length > 0
      ? initialExercises.map((ex, i) => ({ ...ex, order: i }))
      : [
          { id: Date.now(), name: '', sets: 3, reps: 10, weight: undefined, duration: undefined, restTime: 60, order: 0, notes: '' },
        ]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    event.active.data.current.isDragging = true;
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    event.active.data.current.isDragging = false;

    if (over && active.id !== over.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  }, []);

  const handleDragCancel = useCallback((event: DragEndEvent) => {
    event.active.data.current.isDragging = false;
  }, []);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now() + Math.random(),
      name: '',
      sets: 3,
      reps: 10,
      weight: undefined,
      duration: undefined,
      restTime: 60,
      order: exercises.length,
      notes: '',
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const removeExercise = (id: number) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id).map((ex, i) => ({ ...ex, order: i })));
  };

  const updateExercise = (updatedExercise: Exercise) => {
    setExercises((prev) => prev.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex)));
  };

  const handleSave = () => {
    const validExercises = exercises.filter((ex) => ex.name.trim());
    if (validExercises.length === 0) {
      alert('Please add at least one exercise with a name');
      return;
    }
    onSave(validExercises);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-dark-900 dark:text-white">Workout Builder</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={workoutName || ''}
              onChange={(e) => onNameChange?.(e.target.value)}
              placeholder="Workout name"
              className="px-3 py-2 bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
            />
            <button
              onClick={onCancel}
              className="p-2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <SortableContext
            items={exercises.map((ex) => ex.id)}
            strategy={verticalListSortingStrategy}
            collisionDetection={closestCorners}
          >
            <AnimatePresence>
              {exercises.map((exercise, index) => (
                <ExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  onUpdate={updateExercise}
                  onRemove={() => removeExercise(exercise.id)}
                  isDragging={exercise.id === (document.querySelector('[data-dnd-kit-draggable]') as HTMLElement)?.dataset.dndKitDraggableId}
                />
              ))}
            </AnimatePresence>

            <button
              onClick={addExercise}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </SortableContext>
        </div>

        <div className="p-4 border-t border-dark-200 dark:border-dark-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-dark-600 dark:text-dark-300 font-medium rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25"
          >
            Save Workout
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface ExerciseSelectorProps {
  onAddExercise: (exercise: Partial<Exercise>) => void;
}

export function ExerciseSelector({ onAddExercise }: ExerciseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const commonExercises = [
    { name: 'Push-ups', muscle: 'Chest', icon: Dumbbell },
    { name: 'Pull-ups', muscle: 'Back', icon: Dumbbell },
    { name: 'Squats', muscle: 'Legs', icon: Dumbbell },
    { name: 'Deadlifts', muscle: 'Back', icon: Dumbbell },
    { name: 'Bench Press', muscle: 'Chest', icon: Dumbbell },
    { name: 'Overhead Press', muscle: 'Shoulders', icon: Dumbbell },
    { name: 'Barbell Rows', muscle: 'Back', icon: Dumbbell },
    { name: 'Lunges', muscle: 'Legs', icon: Dumbbell },
    { name: 'Plank', muscle: 'Core', icon: Timer },
    { name: 'Burpees', muscle: 'Full Body', icon: Zap },
    { name: 'Mountain Climbers', muscle: 'Core', icon: Zap },
    { name: 'Jump Rope', muscle: 'Cardio', icon: Timer },
  ];

  const filtered = commonExercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-dark-600 dark:text-dark-300 font-medium hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add from Library
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-200 dark:border-dark-700 p-3 max-h-96 overflow-y-auto z-50"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full px-3 py-2 bg-dark-100 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg text-dark-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((ex) => (
              <button
                key={ex.name}
                onClick={() => {
                  onAddExercise({ name: ex.name, sets: 3, reps: 10, restTime: 60 });
                  setIsOpen(false);
                  setSearch('');
                }}
                className="p-3 text-left bg-dark-50 dark:bg-dark-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-dark-200 dark:border-dark-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ex.icon className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-dark-900 dark:text-white">{ex.name}</span>
                </div>
                <span className="text-xs text-dark-500 dark:text-dark-400 block mt-1">{ex.muscle}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}