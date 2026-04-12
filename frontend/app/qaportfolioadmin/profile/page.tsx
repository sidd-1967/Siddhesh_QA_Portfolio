'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

interface Profile {
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  yearsOfExperience?: number;
  heroBio?: string;
  openToWork: boolean;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export default function AdminProfilePage() {
  const [form, setForm] = useState<Partial<Profile>>({ openToWork: false, socialLinks: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [sectionEnabled, setSectionEnabled] = useState<boolean | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    adminAPI.getProfile().then((res) => {
      if (res.data.data) setForm(res.data.data);
    }).finally(() => setLoading(false));

    adminAPI.getSettings().then(res => {
      const config = res.data.data.sectionHeaders['about'];
      if (config) setSectionEnabled(config.enabled !== false);
    }).catch(() => {});
  }, []);

  const handleToggleSection = async () => {
    if (sectionEnabled === null) return;
    setToggling(true);
    try {
      const res = await adminAPI.getSettings();
      const currentConfig = res.data.data;
      if (!currentConfig.sectionHeaders['about']) {
        currentConfig.sectionHeaders['about'] = { title: 'About Me', subtitle: '' };
      }
      currentConfig.sectionHeaders['about'].enabled = !sectionEnabled;
      await adminAPI.updateSettings(currentConfig);
      setSectionEnabled(!sectionEnabled);
      showToast('success', `About section ${!sectionEnabled ? 'enabled' : 'disabled'} successfully!`);
    } catch {
      showToast('error', 'Failed to toggle section visibility');
    } finally {
      setToggling(false);
    }
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.fullName?.trim()) errs.fullName = 'Full name is required';
    if (!form.headline?.trim()) errs.headline = 'Headline is required';
    if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    const links = form.socialLinks || {};
    Object.entries(links).forEach(([key, val]) => {
      if (val && !/^https?:\/\//.test(val)) errs[`social_${key}`] = `${key} must be a valid URL`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await adminAPI.updateProfile(form);
      showToast('success', 'Profile updated successfully!');
    } catch {
      showToast('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const setLink = (key: string, val: string) =>
    setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: val } });

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Edit Profile</h1>
        {sectionEnabled !== null && (
          <label className="toggle-switch" title="Toggle About Me section on website">
            <input 
              type="checkbox" 
              checked={sectionEnabled} 
              onChange={handleToggleSection} 
              disabled={toggling} 
            />
            <div className="toggle-slider"></div>
            <span className="toggle-label-text">Visible</span>
          </label>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-accent)' }}>Personal Info</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className={`form-input${errors.fullName ? ' input-error' : ''}`} value={form.fullName || ''}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Siddhesh Kachave" />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className={`form-input${errors.email ? ' input-error' : ''}`} value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Headline *</label>
            <input className={`form-input${errors.headline ? ' input-error' : ''}`} value={form.headline || ''}
              onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="QA Engineer | Test Automation Specialist" />
            {errors.headline && <span className="form-error">{errors.headline}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Bio (Main About Me)</label>
            <textarea className="form-textarea" rows={5} value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Write a detailed bio..." />
          </div>
          
          <div className="form-group">
            <label className="form-label">Hero Description (Short summary for the first section)</label>
            <textarea className="form-textarea" rows={3} value={form.heroBio || ''}
              onChange={(e) => setForm({ ...form, heroBio: e.target.value })} placeholder="QA Engineer with 3+ years experience..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Pune, India" />
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input type="number" step="0.1" className="form-input" value={form.yearsOfExperience || ''}
                onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} min={0} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <ImageUpload
                label="Profile Image"
                value={form.avatarUrl}
                onChange={(url) => setForm({ ...form, avatarUrl: url })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Resume URL</label>
              <input className="form-input" value={form.resumeUrl || ''}
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} placeholder="https://drive.google.com/..." />
            </div>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
            <input type="checkbox" id="open-to-work" checked={!!form.openToWork}
              onChange={(e) => setForm({ ...form, openToWork: e.target.checked })} />
            <label htmlFor="open-to-work" className="form-label" style={{ margin: 0 }}>Open to Work badge visible on portfolio</label>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-accent)' }}>Social Links</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
              { key: 'github', label: 'GitHub', placeholder: 'https://github.com/...' },
              { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/...' },
              { key: 'website', label: 'Website', placeholder: 'https://yourdomain.com' },
            ].map(({ key, label, placeholder }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input className={`form-input${errors[`social_${key}`] ? ' input-error' : ''}`}
                  value={(form.socialLinks as Record<string, string>)?.[key] || ''}
                  onChange={(e) => setLink(key, e.target.value)}
                  placeholder={placeholder} />
                {errors[`social_${key}`] && <span className="form-error">{errors[`social_${key}`]}</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} id="save-profile-btn">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.msg}
          </div>
        </div>
      )}
      <style>{`.input-error { border-color: var(--color-error) !important; }`}</style>
    </div>
  );
}
