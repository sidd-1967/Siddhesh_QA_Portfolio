import { Router } from 'express';
import { body } from 'express-validator';
import { Skill } from '../models/Skill';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

const skillValidation = [
  body('name').trim().notEmpty().withMessage('Skill name is required').isLength({ max: 80 }),
  body('category').trim().notEmpty().withMessage('Category is required').isLength({ max: 80 }),
  body('proficiency').optional({ checkFalsy: true }).isString(),
  body('iconUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL'),
  body('order').optional().isInt({ min: 0 }),
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const [skills, total] = await Promise.all([
    Skill.find(query).skip(skip).limit(Number(limit)).lean(),
    Skill.countDocuments(query),
  ]);

  res.json({ success: true, data: skills, total, page: Number(page), limit: Number(limit) });
}));

router.post('/', skillValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
}));

router.put('/:id', skillValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!skill) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: skill });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, message: 'Skill deleted' });
}));

export default router;
