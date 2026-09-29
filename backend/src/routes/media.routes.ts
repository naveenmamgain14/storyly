import { Router } from 'express';
import { mediaController, upload } from '../controllers/media.controller';
import { requireAuth } from '../middleware/requireAuth';

export const mediaRouter = Router();

// All media routes require an authenticated admin
mediaRouter.use(requireAuth);

// Media routes
mediaRouter.post('/upload', upload.single('file'), mediaController.upload);
mediaRouter.post('/:id/thumbnail', upload.single('file'), mediaController.uploadThumbnail);
mediaRouter.get('/', mediaController.getAll);
mediaRouter.delete('/:id', mediaController.delete);
