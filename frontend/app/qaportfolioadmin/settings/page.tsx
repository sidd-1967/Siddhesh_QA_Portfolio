'use client';
import { useState, useEffect } from 'react';
import { authAPI, adminAPI } from '@/lib/api';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'content'>('content');
  
  // Security State
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState<Record<string, string>>({});

  // Content Config State
  const [config, setConfig] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    adminAPI.getSettings().then(res => {
      setConfig(res.data.data);
    }).finally(() => setConfigLoading(false));
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Security Logic ---
  const validatePwd = () => {
    const errs: Record<string, string> = {};
    if (!pwdForm.oldPassword) errs.oldPassword = 'Current password is required';
    if (!pwdForm.newPassword) errs.newPassword = 'New password is required';
    else if (pwdForm.newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters';
    if (pwdForm.newPassword !== pwdForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setPwdErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePwdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePwd()) return;
    setPwdLoading(true);
    try {
      await authAPI.changePassword({ oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword });
      showToast('success', 'Password updated successfully!');
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  // --- Config Logic ---
  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await adminAPI.updateSettings(config);
      showToast('success', 'Content configuration saved!');
    } catch {
      showToast('error', 'Failed to save configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const updateHeader = (section: string, field: 'title' | 'subtitle', val: string) => {
    setConfig({
      ...config,
      sectionHeaders: {
        ...config.sectionHeaders,
        [section]: { ...config.sectionHeaders[section], [field]: val }
      }
    });
  };

  const updateArray = (field: 'skillCategories' | 'skillProficiencies', val: string) => {
    setConfig({ ...config, [field]: val.split(',').map(s => s.trim()).filter(Boolean) });
  };

  if (configLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Manage your portfolio configuration and security.</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn${activeTab === 'content' ? ' active' : ''}`} onClick={() => setActiveTab('content')}>Dynamic Content</button>
        <button className={`tab-btn${activeTab === 'security' ? ' active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
      </div>

      {activeTab === 'content' ? (
        <form onSubmit={handleConfigSubmit}>
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 className="section-title-sm">Section Titles & Subtitles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {config && Object.entries(config.sectionHeaders).map(([key, header]: [string, any]) => (
                <div key={key} className="config-group">
                  <label className="config-label">{key.charAt(0).toUpperCase() + key.slice(1)} Section</label>
                  <input
                    className="form-input"
                    value={header.title}
                    onChange={(e) => updateHeader(key, 'title', e.target.value)}
                    placeholder="Title"
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    className="form-input"
                    value={header.subtitle}
                    onChange={(e) => updateHeader(key, 'subtitle', e.target.value)}
                    placeholder="Subtitle"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 className="section-title-sm">Dropdown Options</h2>
            <div className="form-group">
              <label className="form-label">Skill Categories <small>(comma-separated)</small></label>
              <input
                className="form-input"
                value={config.skillCategories.join(', ')}
                onChange={(e) => updateArray('skillCategories', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Skill Proficiencies <small>(comma-separated)</small></label>
              <input
                className="form-input"
                value={config.skillProficiencies.join(', ')}
                onChange={(e) => updateArray('skillProficiencies', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={savingConfig}>
              {savingConfig ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      ) : (
        <div className="card" style={{ padding: '2rem', maxWidth: '500px' }}>
          <h2 className="section-title-sm">Change Password</h2>
          <form onSubmit={handlePwdSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className={`form-input${pwdErrors.oldPassword ? ' input-error' : ''}`}
                value={pwdForm.oldPassword} onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })} />
              {pwdErrors.oldPassword && <span className="form-error">{pwdErrors.oldPassword}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className={`form-input${pwdErrors.newPassword ? ' input-error' : ''}`}
                value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
              {pwdErrors.newPassword && <span className="form-error">{pwdErrors.newPassword}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className={`form-input${pwdErrors.confirmPassword ? ' input-error' : ''}`}
                value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} />
              {pwdErrors.confirmPassword && <span className="form-error">{pwdErrors.confirmPassword}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={pwdLoading} style={{ width: '100%', marginTop: '1rem' }}>
              {pwdLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--color-border); }
        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none; border: none;
          color: var(--color-text-muted);
          font-weight: 600; font-size: 0.9rem;
          cursor: pointer; position: relative;
          transition: all var(--transition-fast);
        }
        .tab-btn:hover { color: var(--color-text-primary); }
        .tab-btn.active { color: var(--color-accent); }
        .tab-btn.active::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2px; background: var(--color-accent);
          box-shadow: 0 0 10px var(--color-accent);
        }
        .section-title-sm { font-size: 1rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--color-accent); }
        .config-group { display: flex; flex-direction: column; }
        .config-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .input-error { border-color: var(--color-error) !important; }
      `}</style>
    </div>
  );
}

