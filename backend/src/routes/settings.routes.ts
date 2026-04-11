import { Router } from 'express';
import { Settings } from '../models/Settings';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// GET settings (public)
router.get('/', asyncHandler(async (_req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    // Create default settings if they don't exist
    settings = await Settings.create({});
  }
  res.json({ success: true, data: settings });
}));

// UPDATE settings (admin)
router.put('/', authMiddleware, asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
  }
  res.json({ success: true, data: settings });
}));

// GET email template (admin)
router.get('/email-template', authMiddleware, asyncHandler(async (_req, res) => {
  let settings = await Settings.findOne().select('emailTemplate');
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json({ success: true, data: settings.emailTemplate });
}));

// UPDATE email template (admin)
router.patch('/email-template', authMiddleware, asyncHandler(async (req, res) => {
  const { subject, body } = req.body;
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ emailTemplate: { subject, body } });
  } else {
    settings.emailTemplate = { subject, body };
    await settings.save();
  }
  res.json({ success: true, data: settings.emailTemplate });
}));

export default router;
