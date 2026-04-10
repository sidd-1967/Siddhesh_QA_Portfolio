import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
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
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'qa_portfolio_uploads',
    allowed_formats: ['png'],
    public_id: (_req: any, file: any) => {
      const name = file.originalname.split('.')[0];
      return `${Date.now()}-${name}`;
    },
  } as any,
});

// Filter for PNG files only as requested by user
const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only .png format allowed!'), false);
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
