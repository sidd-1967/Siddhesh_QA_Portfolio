import { Router } from 'express';
import { body } from 'express-validator';
import { Experience } from '../models/Experience';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

const experienceValidation = [
  body('company').trim().notEmpty().withMessage('Company is required').isLength({ max: 150 }),
  body('role').trim().notEmpty().withMessage('Role is required').isLength({ max: 150 }),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid end date required').custom((endDate, { req }) => {
    if (endDate && req.body.startDate && new Date(endDate) <= new Date(req.body.startDate)) {
      throw new Error('End date must be after start date');
    }
    return true;
  }),
  body('current').optional().isBoolean(),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Max 2000 chars'),
  body('techStack').optional().isArray(),
  body('companyUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL'),
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const query: any = {};
  if (search) {
    query.$or = [
      { company: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  const [experience, total] = await Promise.all([
    Experience.find(query).sort({ current: -1, startDate: -1 }).skip(skip).limit(Number(limit)).lean(),
    Experience.countDocuments(query),
  ]);

  res.json({ success: true, data: experience, total, page: Number(page), limit: Number(limit) });
}));

router.post('/', experienceValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const experience = await Experience.create(req.body);
  res.status(201).json({ success: true, data: experience });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const item = await Experience.findById(req.params.id).lean();
  if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: item });
}));

router.put('/:id', experienceValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: item });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await Experience.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, message: 'Experience deleted' });
}));

export default router;
