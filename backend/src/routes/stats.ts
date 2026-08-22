import { Router, Request, Response } from 'express';
import { getWeeklyProgress, getUserStats, updateUserGoals } from '../services/workout';
import { updateStatsSchema } from '../types';

const router = Router();

router.get('/progress', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const { weeks } = req.query;
    const progress = await getWeeklyProgress(userId, weeks ? parseInt(weeks as string) : 4);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const stats = await getUserStats(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

router.put('/goals', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const parsed = updateStatsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.errors });
    }
    const stats = await updateUserGoals(userId, parsed.data);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update goals' });
  }
});

export default router;