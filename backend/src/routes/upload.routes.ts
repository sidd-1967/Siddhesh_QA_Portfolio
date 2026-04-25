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
    allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
    public_id: (_req: any, file: any) => {
      const name = file.originalname.split('.')[0] || 'upload';
      return `${Date.now()}-${name}`;
    },
  } as any,
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
    fileSize: 5 * 1024 * 1024, // Increased to 5MB for better UX, but still safe
  },
}).single('file');

// Custom error handling wrapper for multer
const uploadMiddleware = (req: any, res: any, next: any) => {
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      console.error('[UPLOAD ERROR] Multer Error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('[UPLOAD ERROR] General Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post('/', authMiddleware, uploadMiddleware, asyncHandler(async (req, res) => {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    console.error('[UPLOAD ERROR] Cloudinary configuration missing');
    res.status(500).json({ success: false, message: 'Cloudinary configuration is missing' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  // With Cloudinary, path is the secure_url
  const fileUrl = (req.file as any).path;
  console.log('[UPLOAD SUCCESS] File uploaded to:', fileUrl);
  res.json({ success: true, data: { url: fileUrl } });
}));

export default router;
