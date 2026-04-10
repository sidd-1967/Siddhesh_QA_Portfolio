import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import MultiSelect from './MultiSelect';
import { adminAPI } from '@/lib/api';

interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  techStack: string[];
  location?: string;
  companyUrl?: string;
  companyLogo?: string;
}

interface Props {
  initialData?: Partial<Experience>;
  onSubmit: (data: Partial<Experience>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function ExperienceForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    company: initialData?.company || '',
    role: initialData?.role || '',
    startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
    endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
    current: initialData?.current || false,
    description: initialData?.description || '',
    techStack: initialData?.techStack || [],
    location: initialData?.location || '',
    companyUrl: initialData?.companyUrl || '',
    companyLogo: initialData?.companyLogo || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    adminAPI.getSkills({ limit: 100 }).then(res => {
      const names = res.data.data.map((s: any) => s.name);
      setAvailableSkills(names);
    }).catch(() => console.error('Failed to load skills'));
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.company.trim()) errs.company = 'Company is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.current && form.endDate && form.startDate && new Date(form.endDate) <= new Date(form.startDate)) {
      errs.endDate = 'End date must be after start date';
    }
    if (form.companyUrl && !/^https?:\/\//.test(form.companyUrl)) errs.companyUrl = 'Must be a valid URL';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...form,
      endDate: form.current ? null : form.endDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Company *</label>
          <input className={`form-input${errors.company ? ' input-error' : ''}`} value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
          {errors.company && <span className="form-error">{errors.company}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Role *</label>
          <input className={`form-input${errors.role ? ' input-error' : ''}`} value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Your job title" />
          {errors.role && <span className="form-error">{errors.role}</span>}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <ImageUpload
          label="Company Logo (PNG)"
          value={form.companyLogo}
          onChange={(url) => setForm({ ...form, companyLogo: url })}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Start Date *</label>
          <input type="date" className={`form-input${errors.startDate ? ' input-error' : ''}`} value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          {errors.startDate && <span className="form-error">{errors.startDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">End Date {form.current ? '(Current)' : ''}</label>
          <input type="date" className={`form-input${errors.endDate ? ' input-error' : ''}`} value={form.endDate}
            disabled={form.current}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          {errors.endDate && <span className="form-error">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
        <input type="checkbox" id="exp-current" checked={form.current}
          onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: '' })} />
        <label htmlFor="exp-current" className="form-label" style={{ margin: 0 }}>Currently working here</label>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.description} rows={4}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your responsibilities and achievements..." />
      </div>

      <MultiSelect
        label="Tech Stack (Fetched from Skills)"
        options={availableSkills}
        selected={form.techStack}
        onChange={(selected) => setForm({ ...form, techStack: selected })}
        placeholder="Select skills used in this role..."
        emptyMessage="No skills added yet. Go to Skills page first."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
        </div>
        <div className="form-group">
          <label className="form-label">Company URL</label>
          <input className={`form-input${errors.companyUrl ? ' input-error' : ''}`} value={form.companyUrl}
            onChange={(e) => setForm({ ...form, companyUrl: e.target.value })} placeholder="https://company.com" />
          {errors.companyUrl && <span className="form-error">{errors.companyUrl}</span>}
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
