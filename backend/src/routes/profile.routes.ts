import { Router } from 'express';
import { body } from 'express-validator';
import { Profile } from '../models/Profile';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

const profileValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
  body('headline').trim().notEmpty().withMessage('Headline is required').isLength({ max: 200 }),
  body('bio').optional().trim().isLength({ max: 3000 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim(),
  body('location').optional().trim().isLength({ max: 150 }),
  body('socialLinks.linkedin').optional({ checkFalsy: true }).isURL().withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.github').optional({ checkFalsy: true }).isURL().withMessage('GitHub must be a valid URL'),
  body('socialLinks.twitter').optional({ checkFalsy: true }).isURL().withMessage('Twitter must be a valid URL'),
  body('socialLinks.website').optional({ checkFalsy: true }).isURL().withMessage('Website must be a valid URL'),
  body('yearsOfExperience').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('heroBio').optional().trim().isLength({ max: 500 }),
  body('openToWork').optional().isBoolean(),
];

router.get('/', asyncHandler(async (_req, res) => {
  const profile = await Profile.findOne().lean();
  res.json({ success: true, data: profile });
}));

// Upsert: create if doesn't exist, update if exists
router.put('/', profileValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const existing = await Profile.findOne();
  let profile;
  if (existing) {
    profile = await Profile.findByIdAndUpdate(existing._id, req.body, { new: true, runValidators: true });
  } else {
    profile = await Profile.create(req.body);
  }
  res.json({ success: true, data: profile });
}));

export default router;
