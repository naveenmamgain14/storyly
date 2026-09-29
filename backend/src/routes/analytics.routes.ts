import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';

export const analyticsRouter = Router();

// Management surface: admin session required
analyticsRouter.use(requireAuth);

// TODO: Implement analytics routes
// GET /analytics/stories/:id
// GET /analytics/overview
// GET /analytics/events
