import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ApiKey } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Every SDK request was costing a database round trip just to check the key,
 * which on a distant database is ~250ms — more than the rest of the request.
 * Keys change rarely, so a short-lived cache removes that entirely.
 *
 * Revocation therefore takes up to KEY_TTL_MS to take effect; that is the
 * deliberate trade, and the window is kept small for it.
 */
const KEY_TTL_MS = 60_000;
const keyCache = new Map<string, { key: ApiKey | null; expiresAt: number }>();

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

    let key: ApiKey | null;
    const cached = keyCache.get(apiKey);
    if (cached && Date.now() < cached.expiresAt) {
      key = cached.key;
    } else {
      key = await prisma.apiKey.findUnique({ where: { key: apiKey } });
      // Negative results are cached too, so a bad key cannot be used to
      // hammer the database.
      keyCache.set(apiKey, { key, expiresAt: Date.now() + KEY_TTL_MS });
    }

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
