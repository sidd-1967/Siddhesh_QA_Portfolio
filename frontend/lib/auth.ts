import { AppConfig } from '@/config/app.config';

// ── Auth helpers (client-side only) ───────────────────────────────────

export const AuthService = {
  /**
   * Save JWT token to localStorage.
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AppConfig.admin.tokenKey, token);
    }
  },

  /**
   * Get JWT token from localStorage.
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AppConfig.admin.tokenKey);
    }
    return null;
  },

  /**
   * Remove JWT token (logout).
   */
  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AppConfig.admin.tokenKey);
    }
  },

  /**
   * Check if a valid (non-expired) token exists.
   */
  isAuthenticated(): boolean {
    const token = AuthService.getToken();
    if (!token) return false;

    try {
      // Decode JWT payload (middle part) without verifying signature
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  },
};
