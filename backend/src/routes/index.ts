import { Router } from 'express';
import { authRouter } from './auth.routes';
import { storyRouter } from './story.routes';
import { mediaRouter } from './media.routes';
import { collectionRouter } from './collection.routes';
import { analyticsRouter } from './analytics.routes';
import { sdkRouter } from './sdk.routes';
import { apiKeyRouter } from './apiKey.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/stories', storyRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/collections', collectionRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/api-keys', apiKeyRouter);

// Public SDK endpoints
apiRouter.use('/sdk', sdkRouter);
