import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/qa-portfolio',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production-use-64-char-random-string',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',

  // reCAPTCHA
  recaptcha: {
    secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
    verifyUrl: 'https://www.google.com/recaptcha/api/siteverify',
    enabled: process.env.RECAPTCHA_ENABLED !== 'false', // set to 'false' in dev
  },

  // CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Security
  bcryptRounds: 12,

  // Rate limiting
  rateLimit: {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,
    },
    contact: {
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 3,
    },
    general: {
      windowMs: 60 * 1000,
      max: 100,
    },
  },

  // Email / Nodemailer (optional for contact form)
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@portfolio.com',
    to: process.env.EMAIL_TO || '',
  },
};
