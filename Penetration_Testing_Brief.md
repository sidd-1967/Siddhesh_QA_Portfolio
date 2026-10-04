# Penetration Testing Brief: QA Portfolio Website

This document outlines the technical architecture, security implementations, and attack surfaces of the QA Portfolio Web Application to assist in a professional penetration testing engagement.

## 1. Architecture Overview
The application is a decoupled full-stack JavaScript application consisting of a public-facing portfolio and an authenticated admin dashboard for content management.

- **Frontend:** Next.js (React), App Router, Tailwind CSS (or custom CSS). Runs on a Node.js server for Server-Side Rendering (SSR) and static generation.
- **Backend:** Node.js with Express.js framework.
- **Database:** MongoDB (Atlas cluster) accessed via Mongoose ODM.
- **Media Storage:** Cloudinary (accessed via API for image uploads).

## 2. Security Implementations & Middleware
The backend incorporates several baseline security measures:
- **Helmet.js:** Sets standard HTTP security headers (HSTS, X-Frame-Options, etc.).
- **Mongo-Sanitize:** Strips keys containing `$` or `.` from `req.body`, `req.query`, or `req.params` to prevent NoSQL injection (`express-mongo-sanitize`).
- **CORS:** Strictly configured to allow requests only from the specified frontend URL via environment variable (`FRONTEND_URL`).
- **Rate Limiting:** Implemented via `express-rate-limit`.
  - **Global:** 100 requests per minute per IP.
  - **Login (`/api/auth/login`):** 5 requests per 15 minutes per IP.
  - **Contact Form (`/api/contact`):** 3 requests per 10 minutes per IP.

## 3. Authentication & Authorization
The application uses JSON Web Tokens (JWT) for stateless authentication.
- **Mechanism:** Users authenticate via email/password. Upon success, the server issues a signed JWT (`config.jwtSecret`).
- **Storage:** The frontend stores the JWT in `localStorage` and attaches it as a `Bearer` token in the `Authorization` header for subsequent requests.
- **Password Storage:** Passwords are hashed using `bcryptjs` with a cost factor of 12 rounds before being stored in MongoDB.
- **Authorization:** The `authMiddleware` verifies the JWT signature and checks if the `userId` still exists in the database before granting access to `/api/admin/*` routes.
- **Roles:** The user model has a hardcoded `role: 'admin'`, though role-based access control (RBAC) is minimally enforced as there is only one intended admin user.

## 4. API Attack Surface (Endpoints)

### Public Endpoints (Unauthenticated)
- `GET /health` - Basic health check.
- `GET /api/public/*` - Retrieves portfolio data (projects, skills, experience, etc.).
- `GET /api/settings` - Retrieves public application settings.
- `POST /api/contact` - Submits a contact form email.
  - **Protections:** Rate limited, sanitised inputs, and relies on **Google reCAPTCHA v3** (token verification via backend before processing). Sends emails via Nodemailer (SMTP).

### Protected Endpoints (Requires valid JWT Bearer Token)
All routes under `/api/admin/*` and protected `/api/auth/*` routes.
- `GET /api/auth/me` - Retrieve current user profile.
- `PUT /api/auth/change-password` - Update password (requires old password validation).
- `GET, POST, PUT, DELETE /api/admin/*` - Full CRUD operations for Projects, Experience, Skills, Education, Certifications, Profile, and Settings.
- `POST /api/admin/upload` - File upload endpoint.
  - **Protections:** Handled via `multer`. Validates MIME types (only `image/png`, `image/jpeg`, `image/jpg`, `image/webp` allowed). Size limit restricted to 5MB. Files are uploaded directly to Cloudinary via `multer-storage-cloudinary`.

## 5. Areas of Interest for Pen-Testing
Please focus the assessment on identifying vulnerabilities in the following areas:
1. **JWT Implementation:** Check for weak signing algorithms, token exposure, lack of token revocation on password change, or ability to forge tokens.
2. **Authentication Bypass:** Attempt to bypass the `authMiddleware` or escalate privileges if arbitrary user creation is possible (note: registration is currently disabled by design).
3. **NoSQL Injection:** Despite `express-mongo-sanitize`, attempt advanced NoSQL injection vectors on authentication and CRUD endpoints.
4. **File Upload Vulnerabilities:** Test the `/api/admin/upload` endpoint for bypasses in MIME type checking, malicious payload uploads (e.g., webshells disguised as images, SVG XSS), or Server-Side Request Forgery (SSRF) via Cloudinary integration.
5. **Cross-Site Scripting (XSS):** Test if input provided in the Admin Dashboard (e.g., project descriptions, HTML content) is properly sanitised when rendered on the public Next.js frontend.
6. **Rate Limiting & DoS:** Verify if the rate limiters can be bypassed (e.g., via `X-Forwarded-For` spoofing) and if the application is susceptible to Application-Layer DoS.
7. **Business Logic Flaws:** Analyze the password change flow, contact form email injection (SMTP header injection), or reCAPTCHA bypasses.

## 6. Environment Configurations
- Node.js environment: Development/Production toggle available via `NODE_ENV`.
- Error Handling: Detailed stack traces are disabled in `production` mode, but test if sensitive data leaks in generic error messages.

*Note: Please ensure all automated scanning and manual exploitation is strictly confined to the agreed-upon testing environments.*
