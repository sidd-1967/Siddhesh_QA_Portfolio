import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: string;
  iconUrl?: string;
  order: number;
}

interface Props {
  initialData?: Partial<Skill>;
  onSubmit: (data: Partial<Skill>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function SkillForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [categories, setCategories] = useState<string[]>(['Testing', 'Automation', 'Languages', 'Tools', 'Frameworks', 'Cloud', 'CI/CD', 'Databases', 'Other']);
  const [proficiencies, setProficiencies] = useState<string[]>(['Beginner', 'Intermediate', 'Advanced', 'Expert']);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [form, setForm] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    proficiency: initialData?.proficiency || '',
    iconUrl: initialData?.iconUrl || '',
    order: initialData?.order ?? 0,
  });

  useEffect(() => {
    adminAPI.getSettings().then(res => {
      const { skillCategories, skillProficiencies } = res.data.data;
      if (skillCategories) setCategories(skillCategories);
      if (skillProficiencies) setProficiencies(skillProficiencies);
      
      // Set defaults if creating new
      if (!initialData?._id) {
        setForm(prev => ({
          ...prev,
          category: skillCategories?.[0] || prev.category,
          proficiency: skillProficiencies?.[0] || prev.proficiency,
        }));
      }
    }).finally(() => setSettingsLoading(false));
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Skill name is required';
    if (form.iconUrl && !/^https?:\/\//.test(form.iconUrl)) errs.iconUrl = 'Must be a valid URL';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Skill Name *</label>
        <input className={`form-input${errors.name ? ' input-error' : ''}`} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Selenium WebDriver" />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-select" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Proficiency *</label>
          <select className="form-select" value={form.proficiency}
            onChange={(e) => setForm({ ...form, proficiency: e.target.value })}>
            {proficiencies.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Icon URL <small style={{ color: 'var(--color-text-muted)' }}>(optional)</small></label>
          <input className={`form-input${errors.iconUrl ? ' input-error' : ''}`} value={form.iconUrl}
            onChange={(e) => setForm({ ...form, iconUrl: e.target.value })} placeholder="https://..." />
          {errors.iconUrl && <span className="form-error">{errors.iconUrl}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Order</label>
          <input type="number" className="form-input" value={form.order} min={0}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
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
