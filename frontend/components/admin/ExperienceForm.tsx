import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import MultiSelect from './MultiSelect';
import SearchableSelect from './SearchableSelect';
import RichTextEditor from './RichTextEditor';
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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() + 5 - i).toString());

const monthToIndex = (name: string) => (MONTHS.indexOf(name) + 1).toString().padStart(2, '0');
const indexToMonth = (idx: string) => MONTHS[parseInt(idx) - 1];

export default function ExperienceForm({ initialData, onSubmit, onCancel, loading }: Props) {
  // Helper to parse "YYYY-MM"
  const parseDate = (d?: string | null) => {
    if (!d || !d.includes('-')) return { month: '', year: '' };
    const [y, m] = d.split('-');
    return { month: indexToMonth(m), year: y };
  };

  const startParsed = parseDate(initialData?.startDate);
  const endParsed = parseDate(initialData?.endDate);

  const [form, setForm] = useState({
    company: initialData?.company || '',
    role: initialData?.role || '',
    startMonth: startParsed.month,
    startYear: startParsed.year,
    endMonth: endParsed.month,
    endYear: endParsed.year,
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
    if (!form.startMonth || !form.startYear) errs.startDate = 'Start date required';
    
    if (!form.current && (form.endMonth || form.endYear)) {
      if (!form.endMonth || !form.endYear) errs.endDate = 'Complete end date required';
      else {
        const start = `${form.startYear}-${monthToIndex(form.startMonth)}`;
        const end = `${form.endYear}-${monthToIndex(form.endMonth)}`;
        if (end <= start) errs.endDate = 'End date must be after start date';
      }
    }
    
    if (form.companyUrl && !/^https?:\/\//.test(form.companyUrl)) errs.companyUrl = 'Must be a valid URL';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const startDate = `${form.startYear}-${monthToIndex(form.startMonth)}`;
    const endDate = form.current ? null : (form.endMonth && form.endYear ? `${form.endYear}-${monthToIndex(form.endMonth)}` : null);

    await onSubmit({
      ...form,
      startDate,
      endDate,
    } as any);
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
          label="Company Logo"
          value={form.companyLogo}
          onChange={(url) => setForm({ ...form, companyLogo: url })}
        />
      </div>

      <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <SearchableSelect 
              label="Start Month *" 
              options={MONTHS} 
              value={form.startMonth} 
              onChange={(v) => setForm({ ...form, startMonth: v })}
              className={errors.startDate ? 'input-error' : ''}
            />
            <SearchableSelect 
              label="Start Year *" 
              options={YEARS} 
              value={form.startYear} 
              onChange={(v) => setForm({ ...form, startYear: v })}
              className={errors.startDate ? 'input-error' : ''}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', opacity: form.current ? 0.5 : 1 }}>
            <SearchableSelect 
              label="End Month" 
              options={MONTHS} 
              value={form.endMonth} 
              onChange={(v) => setForm({ ...form, endMonth: v })}
              className={errors.endDate ? 'input-error' : ''}
            />
            <SearchableSelect 
              label="End Year" 
              options={YEARS} 
              value={form.endYear} 
              onChange={(v) => setForm({ ...form, endYear: v })}
              className={errors.endDate ? 'input-error' : ''}
            />
          </div>
        </div>
        {(errors.startDate || errors.endDate) && (
          <div style={{ marginBottom: '0.5rem' }}>
            {errors.startDate && <span className="form-error" style={{ display: 'block' }}>{errors.startDate}</span>}
            {errors.endDate && <span className="form-error" style={{ display: 'block' }}>{errors.endDate}</span>}
          </div>
        )}
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginBottom: 0 }}>
          <input type="checkbox" id="exp-current" checked={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.checked })} />
          <label htmlFor="exp-current" className="form-label" style={{ margin: 0 }}>Currently working here</label>
        </div>
      </div>

      <RichTextEditor
        label="Description"
        value={form.description}
        onChange={(val) => setForm({ ...form, description: val })}
        placeholder="Describe your responsibilities and achievements (use bold, bullets etc.)..."
        minHeight={200}
      />

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

