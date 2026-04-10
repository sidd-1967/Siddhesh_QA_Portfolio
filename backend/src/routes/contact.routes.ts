import { Router } from 'express';
import { body } from 'express-validator';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { asyncHandler } from '../utils/asyncHandler';
import { handleValidationErrors } from '../middleware/validate.middleware';
import { contactRateLimiter } from '../middleware/rateLimiter';

const router = Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
  body('recaptchaToken').notEmpty().withMessage('reCAPTCHA token is required'),
];

router.post(
  '/',
  contactRateLimiter,
  contactValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, email, subject, message, recaptchaToken } = req.body;

    // Verify reCAPTCHA (skip if disabled in config)
    if (config.recaptcha.enabled && config.recaptcha.secretKey) {
      const verifRes = await axios.post(
        config.recaptcha.verifyUrl,
        new URLSearchParams({
          secret: config.recaptcha.secretKey,
          response: recaptchaToken,
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { success, score } = verifRes.data as { success: boolean; score: number };

      if (!success || (score !== undefined && score < 0.5)) {
        res.status(400).json({
          success: false,
          message: 'reCAPTCHA verification failed. Please try again.',
        });
        return;
      }
    }

    // Send email if configured
    if (config.email.host && config.email.user && config.email.to) {
      const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465,
        auth: { user: config.email.user, pass: config.email.pass },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${config.email.from}>`,
        to: config.email.to,
        replyTo: email,
        subject: `[Portfolio Contact] ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    }

    res.json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
    });
  })
);

export default router;
