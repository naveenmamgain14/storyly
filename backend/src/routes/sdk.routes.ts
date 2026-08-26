import { Router } from 'express';
import { sdkController } from '../controllers/sdk.controller';
import { validateApiKey } from '../middleware/validateApiKey';
import { rateLimiter } from '../middleware/rateLimiter';

export const sdkRouter = Router();

// All SDK routes require API key
sdkRouter.use(validateApiKey);
sdkRouter.use(rateLimiter);

// Get stories for SDK
sdkRouter.get('/stories', sdkController.getStories);

// Get collections for SDK
sdkRouter.get('/collections', sdkController.getCollections);

// Track analytics event
sdkRouter.post('/analytics', sdkController.trackEvent);

// Batch track analytics events
sdkRouter.post('/analytics/batch', sdkController.trackEventsBatch);
