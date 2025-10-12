import { Request, Response, Router } from 'express';
import { ConferenceSession } from '../types';
import { VertexAIService } from '../vertex-ai.service';

const router = Router();

// Load sessions data endpoint
router.post('/sessions/load', async (req: Request, res: Response) => {
  try {
    const { sessions } = req.body as { sessions: ConferenceSession[] };

    if (!sessions || !Array.isArray(sessions)) {
      res.status(400).json({ error: 'Sessions array is required' });
      return;
    }

    const vertexAIService = req.app.get('vertexAIService') as VertexAIService;
    vertexAIService.setSessionsData(sessions);

    res.json({
      message: `Loaded ${sessions.length} sessions successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Load sessions error:', error);
    res.status(500).json({
      error: 'Failed to load sessions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
