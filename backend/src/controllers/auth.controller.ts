import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signToken } from '../middleware/requireAuth';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }

      const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });

      // Same response whether the account is missing, not an admin, or the
      // password is wrong, so this cannot be used to enumerate accounts.
      const invalid = { success: false, error: 'Invalid email or password' };
      if (!user || user.role !== 'ADMIN' || !user.passwordHash) {
        return res.status(401).json(invalid);
      }

      const ok = await bcrypt.compare(String(password), user.passwordHash);
      if (!ok) return res.status(401).json(invalid);

      res.json({
        success: true,
        data: {
          token: signToken(user),
          user: { id: user.id, email: user.email, name: user.name, role: user.role }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  },

  async me(req: Request, res: Response) {
    res.json({ success: true, data: req.authUser });
  }
};
