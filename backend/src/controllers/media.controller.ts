import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  }
});

export const mediaController = {
  // Upload media file
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const file = req.file;
      const type = file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';

      // Get the first user as uploader (temporary - should come from auth)
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return res.status(500).json({
          success: false,
          error: 'No users found in database'
        });
      }

      // Create media record in database
      const media = await prisma.media.create({
        data: {
          filename: file.filename,
          originalFilename: file.originalname,
          mimeType: file.mimetype,
          size: BigInt(file.size),
          storagePath: `/uploads/${file.filename}`,
          cdnUrl: `http://localhost:3000/uploads/${file.filename}`,
          uploadedById: firstUser.id
        }
      });

      res.status(201).json({
        success: true,
        data: media
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload file'
      });
    }
  },

  // Get all media
  async getAll(req: Request, res: Response) {
    try {
      const media = await prisma.media.findMany({
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: media
      });
    } catch (error) {
      console.error('Get media error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch media'
      });
    }
  },

  // Delete media
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const media = await prisma.media.findUnique({
        where: { id }
      });

      if (!media) {
        return res.status(404).json({
          success: false,
          error: 'Media not found'
        });
      }

      // Delete file from disk
      const filePath = path.join(uploadDir, path.basename(media.cdnUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await prisma.media.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Media deleted successfully'
      });
    } catch (error) {
      console.error('Delete media error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete media'
      });
    }
  }
};
