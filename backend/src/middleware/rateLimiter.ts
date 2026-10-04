import rateLimit from 'express-rate-limit';
import { config } from '../config/config';
import { Request } from 'express';

export const loginRateLimiter = rateLimit({
  windowMs: config.rateLimit.login.windowMs,
  max: config.rateLimit.login.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

export const contactRateLimiter = rateLimit({
  windowMs: config.rateLimit.contact.windowMs,
  max: config.rateLimit.contact.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact requests. Please try again later.',
  },
});

export const generalRateLimiter = rateLimit({
  windowMs: config.rateLimit.general.windowMs,
  max: config.rateLimit.general.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after a minute.',
  },
});

// Upload limiter — stricter, keyed per IP to limit Cloudinary abuse
export const uploadRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,                   // 20 uploads per 10 min (legitimate admin use is much lower)
  standardHeaders: true,
  legacyHeaders: false,
  // Key by IP + userId from JWT header (so different admins don't share budget)
  keyGenerator: (req: Request) => {
    const authHeader = req.headers.authorization || '';
    const ipPart = req.ip || 'unknown';
    // Use first 20 chars of the token as a cheap user discriminator (not cryptographic)
    const tokenSnippet = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7, 27)
      : 'anon';
    return `${ipPart}:${tokenSnippet}`;
  },
  message: {
    success: false,
    message: 'Too many upload requests. Please wait 10 minutes before uploading again.',
  },
});
