import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/requireAuth';
import { rateLimiter } from '../middleware/rateLimiter';

export const authRouter = Router();

// There is deliberately no register endpoint: accounts are created on the
// server with scripts/create-admin.js, never over the network.
authRouter.post('/login', rateLimiter, authController.login);
authRouter.get('/me', requireAuth, authController.me);
