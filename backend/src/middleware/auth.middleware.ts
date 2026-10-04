import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

/**
 * Middleware: Verify JWT and attach userId / userRole to request.
 * Also rejects tokens issued before a password change (VULN-05).
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      role: string;
      iat: number;
    };

    // Verify user still exists; also fetch passwordChangedAt for revocation check
    const user = await User.findById(decoded.userId).select('+passwordChangedAt _id role');
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    // SECURITY (VULN-05): Reject token if password was changed after token was issued
    if (user.passwordChangedAt) {
      const changedAtSeconds = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedAtSeconds) {
        res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        return;
      }
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired' });
      return;
    }
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

