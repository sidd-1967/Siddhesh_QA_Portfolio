import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/config';

// Routes
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import projectsRoutes from './routes/projects.routes';
import experienceRoutes from './routes/experience.routes';
import skillsRoutes from './routes/skills.routes';
import educationRoutes from './routes/education.routes';
import certificationsRoutes from './routes/certifications.routes';
import profileAdminRoutes from './routes/profile.routes';
import contactRoutes from './routes/contact.routes';
import settingsRoutes from './routes/settings.routes';
import uploadRoutes from './routes/upload.routes';
import path from 'path';

// Auth middleware for protected admin routes
import { authMiddleware } from './middleware/auth.middleware';
import { generalRateLimiter } from './middleware/rateLimiter';

const app = express();

// ── Security & Utility Middleware ──────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// CORS — only allow configured frontend origin
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// NoSQL injection prevention
app.use(mongoSanitize());

// General rate limiting
app.use('/api/', generalRateLimiter);

// Serve static files from public folder
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// ── Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/contact', contactRoutes);

// Admin routes — all protected by JWT
app.use('/api/admin/projects', authMiddleware, projectsRoutes);
app.use('/api/admin/experience', authMiddleware, experienceRoutes);
app.use('/api/admin/skills', authMiddleware, skillsRoutes);
app.use('/api/admin/education', authMiddleware, educationRoutes);
app.use('/api/admin/certifications', authMiddleware, certificationsRoutes);
app.use('/api/admin/profile', authMiddleware, profileAdminRoutes);
app.use('/api/admin/settings', authMiddleware, settingsRoutes);
app.use('/api/admin/upload', authMiddleware, uploadRoutes);
app.use('/api/settings', settingsRoutes); // Public GET

// ── Health Check ───────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  if (config.nodeEnv === 'development') {
    console.error(err.stack);
  }
  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
});

export default app;
