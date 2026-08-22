import { Router, Request, Response } from 'express';
import { createSession, getSessions, getSessionById, updateSession } from '../services/workout';
import { createSessionSchema, updateSessionSchema } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const { limit, offset, status } = req.query;
    const sessions = await getSessions(userId, {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      status: status as string,
    });
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const session = await getSessionById(parseInt(req.params.id));
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch session' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const parsed = createSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.errors });
    }
    const session = await createSession(userId, parsed.data);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create session' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const parsed = updateSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.errors });
    }
    const session = await updateSession(parseInt(req.params.id), userId, parsed.data);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update session' });
  }
});

router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const userId = 1; // TODO: Get from auth
    const session = await updateSession(parseInt(req.params.id), userId, {
      status: 'completed',
      completedAt: new Date(),
      ...req.body,
    });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to complete session' });
  }
});

export default router;