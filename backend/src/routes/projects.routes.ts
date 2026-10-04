import { Router } from 'express';
import { body } from 'express-validator';
import { Project } from '../models/Project';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Max 100 chars'),
  body('company').optional().trim().isLength({ max: 150 }),
  body('domain').optional().trim().isLength({ max: 100 }),
  body('period').optional().trim().isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }).withMessage('Max 2000 chars'),
  body('topMetric').optional().trim().isLength({ max: 200 }),
  body('achievements').optional().isArray().withMessage('achievements must be an array'),
  body('techStack').optional().isArray().withMessage('techStack must be an array'),
  body('githubUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL'),
  body('liveUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL'),
  body('testReportUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL'),
  body('featured').optional().isBoolean().withMessage('featured must be boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('order must be a positive integer'),
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Escape regex special chars to prevent ReDoS
  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const query: any = {};
  if (search) {
    const safeSearch = escapeRegex(String(search));
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { company: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const [projects, total] = await Promise.all([
    Project.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Project.countDocuments(query),
  ]);

  res.json({ success: true, data: projects, total, page: Number(page), limit: Number(limit) });
}));

router.post('/', projectValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { title, company, domain, period, description, topMetric, achievements,
          techStack, githubUrl, liveUrl, testReportUrl, imageUrl, featured, order,
          role, isCareerEngagement } = req.body;
  const project = await Project.create({
    title, company, domain, period, description, topMetric, achievements,
    techStack, githubUrl, liveUrl, testReportUrl, imageUrl, featured, order,
    role, isCareerEngagement,
  });
  res.status(201).json({ success: true, data: project });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).lean();
  if (!project) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: project });
}));

router.put('/:id', projectValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const { title, company, domain, period, description, topMetric, achievements,
          techStack, githubUrl, liveUrl, testReportUrl, imageUrl, featured, order,
          role, isCareerEngagement } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { title, company, domain, period, description, topMetric, achievements,
      techStack, githubUrl, liveUrl, testReportUrl, imageUrl, featured, order,
      role, isCareerEngagement },
    { new: true, runValidators: true }
  );
  if (!project) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: project });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, message: 'Project deleted' });
}));

export default router;
