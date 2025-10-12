import { Request, Response, Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
