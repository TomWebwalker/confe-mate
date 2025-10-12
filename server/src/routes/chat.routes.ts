import { Request, Response, Router } from 'express';
import { ChatMessage } from '../types';
import { VertexAIService } from '../vertex-ai.service';

const router = Router();

// Chat endpoint with function calling
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const vertexAIService = req.app.get('vertexAIService') as VertexAIService;
    const result = await vertexAIService.chat(messages);

    res.json({
      response: result.response,
      recommendations: result.recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
