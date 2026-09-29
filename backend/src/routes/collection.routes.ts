import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';

export const collectionRouter = Router();

// Management surface: admin session required
collectionRouter.use(requireAuth);

// TODO: Implement collection routes
// GET /collections
// POST /collections
// GET /collections/:id
// PUT /collections/:id
// DELETE /collections/:id
