import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';

export const apiKeyRouter = Router();

// Management surface: admin session required
apiKeyRouter.use(requireAuth);

// TODO: Implement API key management routes
// GET /api-keys
// POST /api-keys
// DELETE /api-keys/:id
// PUT /api-keys/:id/toggle
