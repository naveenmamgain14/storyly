import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

declare global {
  namespace Express {
    interface Request {
      authUser?: { id: string; email: string; role: string; name: string };
    }
  }
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export const signToken = (user: { id: string; email: string; role: string }): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: '12h'
  });
};

/**
 * Dashboard sessions. The SDK endpoints stay on API keys — this is only for
 * the management surface, where a shared key would let anyone who read the
 * JavaScript bundle edit content.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET missing');
      return res.status(500).json({ success: false, error: 'Server auth not configured' });
    }

    let payload: TokenPayload;
    try {
      payload = jwt.verify(header.slice(7), secret) as TokenPayload;
    } catch {
      return res.status(401).json({ success: false, error: 'Session expired' });
    }

    // Re-read the user each request so a demotion takes effect immediately
    // rather than lasting until the token expires.
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Not permitted' });
    }

    req.authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};
