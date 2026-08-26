import { Router } from 'express';
import { mediaController, upload } from '../controllers/media.controller';
import { validateApiKey } from '../middleware/auth';

export const mediaRouter = Router();

// All media routes require API key
mediaRouter.use(validateApiKey);

// Media routes
mediaRouter.post('/upload', upload.single('file'), mediaController.upload);
mediaRouter.get('/', mediaController.getAll);
mediaRouter.delete('/:id', mediaController.delete);
