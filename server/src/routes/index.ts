import { Router } from 'express';
import healthRoutes from './health.routes';
import chatRoutes from './chat.routes';
import sessionsRoutes from './sessions.routes';

const router = Router();

// Register all route modules
router.use(healthRoutes);
router.use(chatRoutes);
router.use(sessionsRoutes);

export default router;
