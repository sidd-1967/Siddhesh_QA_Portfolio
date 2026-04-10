'use client';
import { useState } from 'react';

interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;
  grade?: string;
  description?: string;
}

interface Props {
  initialData?: Partial<Education>;
  onSubmit: (data: Partial<Education>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function EducationForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    institution: initialData?.institution || '',
    degree: initialData?.degree || '',
    field: initialData?.field || '',
    startYear: initialData?.startYear || new Date().getFullYear(),
    endYear: initialData?.endYear || '',
    grade: initialData?.grade || '',
    description: initialData?.description || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.institution.trim()) errs.institution = 'Institution is required';
    if (!form.degree.trim()) errs.degree = 'Degree is required';
    if (!form.startYear) errs.startYear = 'Start year is required';
    if (form.endYear && Number(form.endYear) < Number(form.startYear)) {
      errs.endYear = 'End year must be after start year';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, endYear: form.endYear ? Number(form.endYear) : null });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Institution *</label>
        <input className={`form-input${errors.institution ? ' input-error' : ''}`} value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="University / College" />
        {errors.institution && <span className="form-error">{errors.institution}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Degree *</label>
          <input className={`form-input${errors.degree ? ' input-error' : ''}`} value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="B.E., MBA, etc." />
          {errors.degree && <span className="form-error">{errors.degree}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Field of Study</label>
          <input className="form-input" value={form.field}
            onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="Computer Engineering" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Start Year *</label>
          <input type="number" className={`form-input${errors.startYear ? ' input-error' : ''}`} value={form.startYear}
            onChange={(e) => setForm({ ...form, startYear: Number(e.target.value) })} min={1950} max={2100} />
          {errors.startYear && <span className="form-error">{errors.startYear}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">End Year</label>
          <input type="number" className={`form-input${errors.endYear ? ' input-error' : ''}`} value={form.endYear}
            onChange={(e) => setForm({ ...form, endYear: e.target.value })} min={1950} max={2100} placeholder="or blank" />
          {errors.endYear && <span className="form-error">{errors.endYear}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Grade / GPA</label>
          <input className="form-input" value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="8.0 CGPA" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes / Description</label>
        <textarea className="form-textarea" value={form.description} rows={3}
          onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional details..." />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </div>
      <style>{`.input-error { border-color: var(--color-error) !important; }`}</style>
    </form>
  );
}
