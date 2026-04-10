import axios from 'axios';
import { AppConfig } from '@/config/app.config';

// ── Axios instance wired to the backend API ───────────────────────────
const api = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AppConfig.admin.tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isSecretAdmin = window.location.pathname.startsWith('/qaportfolioadmin');
      if (isSecretAdmin && !window.location.pathname.includes('/qaportfolioadmin/login')) {
        localStorage.removeItem(AppConfig.admin.tokenKey);
        window.location.href = '/qaportfolioadmin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Public API helpers ────────────────────────────────────────────────
export const publicAPI = {
  getProfile: () => api.get('/api/public/profile'),
  getSkills: () => api.get('/api/public/skills'),
  getExperience: () => api.get('/api/public/experience'),
  getProjects: () => api.get('/api/public/projects'),
  getEducation: () => api.get('/api/public/education'),
  getCertifications: () => api.get('/api/public/certifications'),
  getSettings: () => api.get('/api/settings'),
  submitContact: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    recaptchaToken: string;
  }) => api.post('/api/contact', data),
};

// ── Auth API helpers ──────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  changePassword: (data: any) => api.put('/api/auth/change-password', data),
};

// ── Admin API helpers ─────────────────────────────────────────────────
const adminUrl = (resource: string) => `/api/admin/${resource}`;

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

const getWithParams = (url: string, params?: QueryParams) => api.get(url, { params });

export const adminAPI = {
  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Settings / Config
  getSettings: () => api.get('/api/admin/settings'),
  updateSettings: (data: unknown) => api.put('/api/admin/settings', data),

  // Profile
  getProfile: () => api.get(adminUrl('profile')),
  updateProfile: (data: unknown) => api.put(adminUrl('profile'), data),

  // Projects
  getProjects: (params?: QueryParams) => getWithParams(adminUrl('projects'), params),
  createProject: (data: unknown) => api.post(adminUrl('projects'), data),
  updateProject: (id: string, data: unknown) => api.put(`${adminUrl('projects')}/${id}`, data),
  deleteProject: (id: string) => api.delete(`${adminUrl('projects')}/${id}`),

  // Experience
  getExperience: (params?: QueryParams) => getWithParams(adminUrl('experience'), params),
  createExperience: (data: unknown) => api.post(adminUrl('experience'), data),
  updateExperience: (id: string, data: unknown) => api.put(`${adminUrl('experience')}/${id}`, data),
  deleteExperience: (id: string) => api.delete(`${adminUrl('experience')}/${id}`),

  // Skills
  getSkills: (params?: QueryParams) => getWithParams(adminUrl('skills'), params),
  createSkill: (data: unknown) => api.post(adminUrl('skills'), data),
  updateSkill: (id: string, data: unknown) => api.put(`${adminUrl('skills')}/${id}`, data),
  deleteSkill: (id: string) => api.delete(`${adminUrl('skills')}/${id}`),

  // Education
  getEducation: (params?: QueryParams) => getWithParams(adminUrl('education'), params),
  createEducation: (data: unknown) => api.post(adminUrl('education'), data),
  updateEducation: (id: string, data: unknown) => api.put(`${adminUrl('education')}/${id}`, data),
  deleteEducation: (id: string) => api.delete(`${adminUrl('education')}/${id}`),

  // Certifications
  getCertifications: (params?: QueryParams) => getWithParams(adminUrl('certifications'), params),
  createCertification: (data: unknown) => api.post(adminUrl('certifications'), data),
  updateCertification: (id: string, data: unknown) => api.put(`${adminUrl('certifications')}/${id}`, data),
  deleteCertification: (id: string) => api.delete(`${adminUrl('certifications')}/${id}`),
};

export default api;
