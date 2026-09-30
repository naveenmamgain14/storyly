import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/requireAuth';

export const analyticsRouter = Router();

// Management surface: admin session required
analyticsRouter.use(requireAuth);

analyticsRouter.get('/overview', analyticsController.overview);
analyticsRouter.get('/stories', analyticsController.byStory);
analyticsRouter.get('/daily', analyticsController.daily);
