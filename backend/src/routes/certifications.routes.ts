import { Router } from 'express';
import { body } from 'express-validator';
import { Certification } from '../models/Certification';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';

const router = Router();

const certValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('issuer').trim().notEmpty().withMessage('Issuer is required').isLength({ max: 200 }),
  body('issueDate').isISO8601().withMessage('Valid issue date required'),
  body('expiryDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid expiry date required')
    .custom((expiry, { req }) => {
      if (expiry && req.body.issueDate && new Date(expiry) <= new Date(req.body.issueDate)) {
        throw new Error('Expiry date must be after issue date');
      }
      return true;
    }),
  body('credentialUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL'),
  body('badgeUrl').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL'),
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { issuer: { $regex: search, $options: 'i' } },
      { credentialId: { $regex: search, $options: 'i' } },
    ];
  }

  const [certifications, total] = await Promise.all([
    Certification.find(query).sort({ issueDate: -1 }).skip(skip).limit(Number(limit)).lean(),
    Certification.countDocuments(query),
  ]);

  res.json({ success: true, data: certifications, total, page: Number(page), limit: Number(limit) });
}));

router.post('/', certValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const cert = await Certification.create(req.body);
  res.status(201).json({ success: true, data: cert });
}));

router.put('/:id', certValidation, handleValidationErrors, asyncHandler(async (req, res) => {
  const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!cert) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: cert });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const cert = await Certification.findByIdAndDelete(req.params.id);
  if (!cert) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, message: 'Certification deleted' });
}));

export default router;
