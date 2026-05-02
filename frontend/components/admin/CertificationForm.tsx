'use client';
import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}

interface Props {
  initialData?: Partial<Certification>;
  onSubmit: (data: Partial<Certification>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function CertificationForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    issuer: initialData?.issuer || '',
    issueDate: initialData?.issueDate ? initialData.issueDate.split('T')[0] : '',
    expiryDate: initialData?.expiryDate ? initialData.expiryDate.split('T')[0] : '',
    credentialId: initialData?.credentialId || '',
    credentialUrl: initialData?.credentialUrl || '',
    badgeUrl: initialData?.badgeUrl || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.issuer.trim()) errs.issuer = 'Issuer is required';
    if (!form.issueDate) errs.issueDate = 'Issue date is required';
    if (form.expiryDate && form.issueDate && new Date(form.expiryDate) <= new Date(form.issueDate)) {
      errs.expiryDate = 'Expiry must be after issue date';
    }
    if (form.credentialUrl && !/^https?:\/\//.test(form.credentialUrl)) errs.credentialUrl = 'Must be a valid URL';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, expiryDate: form.expiryDate || null });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Certification Name *</label>
        <input className={`form-input${errors.name ? ' input-error' : ''}`} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., ISTQB Foundation Level" />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Issuer *</label>
        <input className={`form-input${errors.issuer ? ' input-error' : ''}`} value={form.issuer}
          onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="e.g., ISTQB, Udemy" />
        {errors.issuer && <span className="form-error">{errors.issuer}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Issue Date *</label>
          <input type="date" className={`form-input${errors.issueDate ? ' input-error' : ''}`} value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
          {errors.issueDate && <span className="form-error">{errors.issueDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Expiry Date</label>
          <input type="date" className={`form-input${errors.expiryDate ? ' input-error' : ''}`} value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          {errors.expiryDate && <span className="form-error">{errors.expiryDate}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Credential ID</label>
        <input className="form-input" value={form.credentialId}
          onChange={(e) => setForm({ ...form, credentialId: e.target.value })} placeholder="ABC-123456" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Credential URL</label>
          <input className={`form-input${errors.credentialUrl ? ' input-error' : ''}`} value={form.credentialUrl}
            onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://..." />
          {errors.credentialUrl && <span className="form-error">{errors.credentialUrl}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Certificate Image (Optional)</label>
          <ImageUpload
            label="Upload Certificate Image"
            onUpload={(url) => setForm({ ...form, badgeUrl: url })}
            defaultImage={form.badgeUrl}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </div>
      <style>{`.input-error { border-color: var(--color-error) !important; }`}</style>
    </form>
  );
}
