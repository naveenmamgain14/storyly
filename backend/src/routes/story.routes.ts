import { Router } from 'express';
import { storyController } from '../controllers/story.controller';
import { requireAuth } from '../middleware/requireAuth';

export const storyRouter = Router();

// All story routes require an authenticated admin
storyRouter.use(requireAuth);

// Story management routes
storyRouter.get('/', storyController.getAll);
storyRouter.post('/', storyController.create);
storyRouter.get('/:id', storyController.getOne);
storyRouter.put('/:id', storyController.update);
storyRouter.delete('/:id', storyController.delete);
storyRouter.post('/:id/publish', storyController.publish);
