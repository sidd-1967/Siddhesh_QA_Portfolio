// ── App Configuration ──────────────────────────────────────────────────
// All environment variables and app-wide settings are managed here.
// Never hard-code keys or URLs outside this file.

export const AppConfig = {
  // Backend API base URL (set in .env.local)
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',

  // App metadata
  app: {
    name: 'Siddhesh Govalkar | QA Engineer',
    description:
      'QA Engineer portfolio showcasing test automation expertise, projects, and certifications.',
    author: 'Siddhesh Govalkar',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'siddhesh@example.com',
  },

  // Google reCAPTCHA v3
  recaptcha: {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
    // Set to false to skip reCAPTCHA during local development
    enabled: process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED !== 'false',
  },

  // Admin portal
  admin: {
    loginPath: '/qaportfolioadmin/login',
    dashboardPath: '/qaportfolioadmin/dashboard',
    // JWT stored in localStorage under this key
    tokenKey: 'qa_portfolio_admin_token',
  },

  // Scroll animation observer threshold
  animation: {
    observerThreshold: 0.15,
  },
} as const;
