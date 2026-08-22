import { Router, Request, Response } from 'express';
import { createWorkout, getWorkouts, getWorkoutById, updateWorkout, deleteWorkout } from '../services/workout';
import { createWorkoutSchema, updateWorkoutSchema } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const { isTemplate, limit, offset } = req.query;
    const workouts = await getWorkouts(userId, {
      isTemplate: isTemplate === 'true' ? true : isTemplate === 'false' ? false : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch workouts' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await getWorkoutById(parseInt(req.params.id));
    if (!workout) {
      return res.status(404).json({ success: false, error: 'Workout not found' });
    }
    res.json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch workout' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const parsed = createWorkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.errors });
    }
    const workout = await createWorkout(userId, parsed.data);
    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create workout' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const parsed = updateWorkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.errors });
    }
    const workout = await updateWorkout(parseInt(req.params.id), userId, parsed.data);
    if (!workout) {
      return res.status(404).json({ success: false, error: 'Workout not found' });
    }
    res.json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update workout' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const success = await deleteWorkout(parseInt(req.params.id), userId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Workout not found' });
    }
    res.json({ success: true, message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete workout' });
  }
});

export default router;