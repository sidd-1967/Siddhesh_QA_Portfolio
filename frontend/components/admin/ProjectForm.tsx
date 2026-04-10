'use client';
import { useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
}

interface Props {
  initialData?: Partial<Project>;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function ProjectForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    techStack: initialData?.techStack?.join(', ') || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    imageUrl: initialData?.imageUrl || '',
    featured: initialData?.featured || false,
    order: initialData?.order ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 100) errs.title = 'Max 100 characters';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.description.length > 1000) errs.description = 'Max 1000 characters';
    if (form.githubUrl && !/^https?:\/\//.test(form.githubUrl)) errs.githubUrl = 'Must be a valid URL';
    if (form.liveUrl && !/^https?:\/\//.test(form.liveUrl)) errs.liveUrl = 'Must be a valid URL';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...form,
      techStack: form.techStack ? form.techStack.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className={`form-input${errors.title ? ' input-error' : ''}`} value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description * <small style={{ color: 'var(--color-text-muted)' }}>({form.description.length}/1000)</small></label>
        <textarea className={`form-textarea${errors.description ? ' input-error' : ''}`} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project description" rows={4} />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Tech Stack <small style={{ color: 'var(--color-text-muted)' }}>(comma-separated)</small></label>
        <input className="form-input" value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="Selenium, Java, TestNG" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">GitHub URL</label>
          <input className={`form-input${errors.githubUrl ? ' input-error' : ''}`} value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
          {errors.githubUrl && <span className="form-error">{errors.githubUrl}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Live URL</label>
          <input className={`form-input${errors.liveUrl ? ' input-error' : ''}`} value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
          {errors.liveUrl && <span className="form-error">{errors.liveUrl}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-input" value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label className="form-label">Order</label>
          <input type="number" className="form-input" value={form.order} min={0}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
        <input type="checkbox" id="proj-featured" checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
        <label htmlFor="proj-featured" className="form-label" style={{ margin: 0 }}>Featured project</label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      <style>{`.input-error { border-color: var(--color-error) !important; }`}</style>
    </form>
  );
}
