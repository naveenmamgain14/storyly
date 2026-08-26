import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ApiKey } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request type to include apiKey
declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKey;
    }
  }
}

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key is required'
      });
    }

    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey }
    });

    if (!key || !key.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive API key'
      });
    }

    // Attach API key to request
    req.apiKey = key;

    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate API key'
    });
  }
};
