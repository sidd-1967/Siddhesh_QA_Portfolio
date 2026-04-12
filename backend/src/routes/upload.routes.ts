import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
const cloudinaryStorage = require('multer-storage-cloudinary');
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { config } from '../config/config';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Set up Cloudinary Storage for Multer
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'qa_portfolio_uploads',
  allowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
  filename: function (_req: any, file: any, cb: any) {
    const name = file.originalname.split('.')[0];
    cb(undefined, `${Date.now()}-${name}`);
  }
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, .jpeg and .webp format allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

router.post('/', authMiddleware, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  // With Cloudinary, path/filename is the secure_url
  const fileUrl = (req.file as any).path;
  res.json({ success: true, data: { url: fileUrl } });
}));

export default router;
