import { Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/config';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();

// Validation rules for login
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation for password change
const passwordChangeValidation = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

/**
 * POST /api/auth/login
 * Returns a signed JWT on success.
 */
router.post(
  '/login',
  loginRateLimiter,
  loginValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry } as jwt.SignOptions
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  })
);

/**
 * GET /api/auth/me
 * Returns current user info. Requires valid JWT.
 */
router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, user });
  })
);

/**
 * PUT /api/auth/change-password
 * Changes the current user's password.
 */
router.put(
  '/change-password',
  authMiddleware,
  passwordChangeValidation,
  handleValidationErrors,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    // Find user and include password for comparison
    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Verify old password
    const match = await user.comparePassword(oldPassword);
    if (!match) {
      res.status(400).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  })
);

export default router;
