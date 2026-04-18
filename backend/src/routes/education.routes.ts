import { Router } from 'express';
import { body } from 'express-validator';
import { Education } from '../models/Education';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

const educationValidation = [
  body('institution').trim().notEmpty().withMessage('Institution is required').isLength({ max: 200 }),
  body('degree').trim().notEmpty().withMessage('Degree is required').isLength({ max: 200 }),
  body('field').optional().trim().isLength({ max: 200 }),
  body('startYear').isInt({ min: 1950, max: 2100 }).withMessage('Valid start year required'),
  body('endYear').optional({ checkFalsy: true }).isInt({ min: 1950, max: 2100 })
    .withMessage('Valid end year required')
    .custom((endYear, { req }) => {
      if (endYear && req.body.startYear && endYear < req.body.startYear) {
        throw new Error('End year must be after start year');
      }
      return true;
    }),
  body('grade').optional().trim().isLength({ max: 50 }),
  body('location').optional().trim().isLength({ max: 200 }),
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const query: any = {};
  if (search) {
    query.$or = [
      { institution: { $regex: search, $options: 'i' } },
      { degree: { $regex: search, $options: 'i' } },
    ];
  }

  const [education, total] = await Promise.all([
    Education.find(query).sort({ endYear: -1 }).skip(skip).limit(Number(limit)).lean(),
    Education.countDocuments(query),
  ]);

  res.json({ success: true, data: education, total, page: Number(page), limit: Number(limit) });
}));

router.post('/', educationValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const education = await Education.create(req.body);
  res.status(201).json({ success: true, data: education });
}));

router.put('/:id', educationValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: item });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await Education.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, message: 'Education deleted' });
}));

export default router;
