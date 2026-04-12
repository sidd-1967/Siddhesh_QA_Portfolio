'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, publicAPI } from '@/lib/api';
import { AuthService } from '@/lib/auth';
import { AppConfig } from '@/config/app.config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
   const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [initials, setInitials] = useState('');

  useEffect(() => {
    publicAPI.getProfile().then(res => {
      const name = res.data.data?.fullName;
      if (name) {
        const ini = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
        setInitials(ini);
      }
    }).catch(() => {});
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await authAPI.login(form.email, form.password);
      AuthService.setToken(res.data.token);
      router.push(AppConfig.admin.dashboardPath);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMsg(axiosErr?.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card card">
      <div className="login-header">
        <div className="login-logo">
          <span className="gradient-text" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem' }}>{initials}</span>
        </div>
        <h1 className="login-title">Admin Portal</h1>
        <p className="login-sub">Sign in to manage your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            className={`form-input${errors.email ? ' input-error' : ''}`}
            placeholder="admin@portfolio.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className={`form-input${errors.password ? ' input-error' : ''}`}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        {errorMsg && (
          <div className="login-error">{errorMsg}</div>
        )}

        <button
          type="submit"
          id="login-submit-btn"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="login-back">
        <a href="/" className="login-back-link">← Back to Portfolio</a>
      </div>

      <style>{`
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
        }
        .login-header { text-align: center; margin-bottom: 2rem; }
        .login-logo {
          width: 64px; height: 64px;
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: var(--radius-xl);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .login-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.375rem; }
        .login-sub { font-size: 0.875rem; color: var(--color-text-muted); }
        .input-error { border-color: var(--color-error) !important; }
        .login-error {
          background: rgba(255,107,107,0.1);
          border: 1px solid rgba(255,107,107,0.3);
          color: var(--color-error);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .login-back { text-align: center; margin-top: 1.5rem; }
        .login-back-link { font-size: 0.85rem; color: var(--color-text-muted); text-decoration: none; transition: color var(--transition-fast); }
        .login-back-link:hover { color: var(--color-accent); }
      `}</style>
    </div>
  );
}
