# QA Engineer Portfolio — Full Stack Application

A production-ready, dynamic portfolio website + admin portal built for **Siddhesh Kachave**, QA Engineer.

## 🏗️ Architecture

```
Frontend (Next.js) ──→ Backend API (Express) ──→ MongoDB Atlas
   Vercel                   Render                 Atlas Free M0
```

| Layer | Tech | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR + ISR for SEO, free on Vercel |
| Backend | Node.js + Express + TypeScript | Lightweight REST API |
| Database | MongoDB + Mongoose | Flexible schema for resume data |
| Auth | JWT + bcryptjs | Stateless, secure |
| Styling | Vanilla CSS | Full control, no build bloat |

---

## 📁 Project Structure

```
Siddhesh_QA_Portfolio/
├── backend/           # Express API (TypeScript)
│   ├── src/
│   │   ├── app.ts           # Express setup (CORS, middleware)
│   │   ├── server.ts        # Entry point
│   │   ├── config/config.ts # ALL env vars centralised here
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Auth, public, admin CRUD routes
│   │   ├── middleware/       # JWT auth, validation, rate limiting
│   │   └── utils/seed.ts    # Database seeder
│   ├── .env.example
│   └── package.json
│
└── frontend/          # Next.js App
    ├── app/
    │   ├── page.tsx         # Public portfolio (ISR)
    │   └── admin/           # Protected admin portal
    ├── components/
    │   ├── public/          # Portfolio sections
    │   └── admin/           # CRUD pages, forms, sidebar
    ├── lib/api.ts           # Axios client with JWT interceptors
    ├── lib/auth.ts          # JWT helpers (client-side)
    ├── config/app.config.ts # ALL frontend env vars centralised
    └── .env.local.example
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas free tier)

### Step 1 — Clone & Setup Backend

```bash
cd backend

# Copy env file and fill in values
copy .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, etc.

# Install dependencies
npm install

# Seed database (creates admin user + sample data)
npm run seed

# Start development server
npm run dev
# → API running at http://localhost:5000
```

### Step 2 — Setup Frontend

```bash
cd frontend

# Copy env file
copy .env.local.example .env.local
# Edit .env.local: set NEXT_PUBLIC_API_URL=http://localhost:5000

# Install dependencies (already done by create-next-app)
npm install

# Install axios (required)
npm install axios

# Start development server
npm run dev
# → Frontend at http://localhost:3000
```

### Step 3 — Access the App

| URL | Description |
|---|---|
| `http://localhost:3000` | Public portfolio |
| `http://localhost:3000/admin/login` | Admin portal login |

**Default Admin Credentials** (after running `npm run seed`):
- Email: `admin@portfolio.com`
- Password: `Admin@1234`
- ⚠️ **Change this password after first login!**

---

## 🔑 Admin Portal Guide

### Login
1. Go to `/admin/login`
2. Enter your admin email and password
3. You'll be redirected to the dashboard

### Managing Content

| Section | What you can do |
|---|---|
| **Profile** | Edit name, headline, bio, avatar, resume URL, social links |
| **Projects** | Add/edit/delete projects with title, description, tech stack, GitHub/live links |
| **Experience** | Manage work history with dates, company, role, tech stack |
| **Skills** | Add skills by category (Testing, Automation, Languages, etc.) and proficiency |
| **Education** | Manage academic background |
| **Certifications** | Add credentials with issuer, dates, credential IDs |

### Propagation
- After saving in admin, changes appear on the public portfolio within **60 seconds** (Next.js ISR)
- In development, changes are instant (no caching)

---

## 📡 API Endpoints

### Public (No Auth)
```
GET  /api/public/profile
GET  /api/public/skills
GET  /api/public/experience
GET  /api/public/projects
GET  /api/public/education
GET  /api/public/certifications
POST /api/contact
GET  /health
```

### Auth
```
POST /api/auth/login     { email, password }
GET  /api/auth/me        (JWT required)
```

### Admin CRUD (JWT required)
```
GET    /api/admin/projects
POST   /api/admin/projects
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id
# Same pattern for /experience /skills /education /certifications
GET    /api/admin/profile
PUT    /api/admin/profile
```

---

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ JWT authentication (7-day expiry)
- ✅ Rate limiting: login (5/15min), contact (3/10min)
- ✅ CORS restricted to configured frontend URL
- ✅ MongoDB injection prevention (`express-mongo-sanitize`)
- ✅ HTTP security headers (`helmet`)
- ✅ Body size limit (10kb)
- ✅ Google reCAPTCHA v3 on contact form
- ✅ All inputs validated server-side

---

## ☁️ Deployment

### 1. MongoDB Atlas
1. Sign up at https://atlas.mongodb.com
2. Create free **M0** cluster
3. Create database user
4. Whitelist `0.0.0.0/0` IPs
5. Copy connection string

### 2. Backend → Render.com
1. Push backend to GitHub
2. Create Web Service on Render
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=<64-char random string>
   JWT_EXPIRY=7d
   FRONTEND_URL=https://your-app.vercel.app
   RECAPTCHA_SECRET_KEY=...
   RECAPTCHA_ENABLED=true
   NODE_ENV=production
   ```
6. After deploy, run seed: pull repo, `npm run seed`

> Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Frontend → Vercel
1. Push frontend to GitHub
2. Import on https://vercel.com
3. Framework: **Next.js** (auto-detected)
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
   NEXT_PUBLIC_RECAPTCHA_ENABLED=true
   ```
5. Deploy

### 4. Google reCAPTCHA
1. Go to https://www.google.com/recaptcha/admin
2. Register site with **reCAPTCHA v3** type
3. Add your domain (and `localhost` for dev)
4. Copy Site Key (frontend) and Secret Key (backend)

---

## 🧪 QA Test Checklist

### Smoke Tests
- [ ] Portfolio loads with all sections visible
- [ ] Skills bars animate on scroll
- [ ] Experience timeline renders correctly
- [ ] Projects cards show GitHub/live links
- [ ] Contact form submits successfully
- [ ] Contact form blocked without filling required fields

### Admin Tests
- [ ] Wrong password → error shown, no access granted
- [ ] Correct credentials → redirected to dashboard
- [ ] Add Project → appears on public site within 60s
- [ ] Edit Skill → proficiency bar updated on site
- [ ] Delete Certification → removed from public view
- [ ] Navigate away from admin with no login → redirected to login page
- [ ] Direct API call without JWT → 401 Unauthorized

### Validation Tests
- [ ] Project title empty → "Title is required"
- [ ] Invalid GitHub URL → "Must be a valid URL"
- [ ] Experience endDate < startDate → "End date must be after start date"
- [ ] Login with < 8 char password → "Password must be at least 8 characters"
- [ ] Contact message < 10 chars → validation error

---

## 🛠️ Development Tips

- **Skip reCAPTCHA locally**: set `RECAPTCHA_ENABLED=false` in both `.env` files
- **Email notifications off locally**: leave `EMAIL_HOST` empty in backend `.env`
- **TypeScript errors**: run `npx tsc --noEmit` in backend to check
- **Rebuild frontend types**: `npm run build` in frontend

---

## 📄 License

MIT — Free to use and modify for personal portfolio purposes.
