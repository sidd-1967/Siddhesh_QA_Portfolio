'use client';
import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';

interface Project {
  _id: string;
  title: string;
  company?: string;
  domain?: string;
  period?: string;
  description: string;
  topMetric?: string;
  achievements?: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  testReportUrl?: string;
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
    company: initialData?.company || '',
    domain: initialData?.domain || '',
    period: initialData?.period || '',
    description: initialData?.description || '',
    topMetric: initialData?.topMetric || '',
    achievements: initialData?.achievements?.join('\n') || '',
    techStack: initialData?.techStack?.join(', ') || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    testReportUrl: initialData?.testReportUrl || '',
    imageUrl: initialData?.imageUrl || '',
    featured: initialData?.featured || false,
    order: initialData?.order ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 100) errs.title = 'Max 100 characters';
    if (!form.description || form.description === '<p><br></p>') errs.description = 'Description is required';
    if (form.githubUrl && !/^https?:\/\//.test(form.githubUrl)) errs.githubUrl = 'Must be a valid URL';
    if (form.liveUrl && !/^https?:\/\//.test(form.liveUrl)) errs.liveUrl = 'Must be a valid URL';
    if (form.testReportUrl && !/^https?:\/\//.test(form.testReportUrl)) errs.testReportUrl = 'Must be a valid URL';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...form,
      techStack: form.techStack ? form.techStack.split(',').map((t) => t.trim()).filter(Boolean) : [],
      achievements: form.achievements
        ? form.achievements.split('\n').map((a) => a.trim()).filter(Boolean)
        : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Core Identity ──────────────────────────────────── */}
      <p className="proj-form-section-label">Core identity</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Project Title *
            <small style={{ color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>
              (hook: what it is)
            </small>
          </label>
          <input
            className={`form-input${errors.title ? ' input-error' : ''}`}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="E-commerce · UK worktops configurator"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            className="form-input"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="House of Worktops"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Domain
            <small style={{ color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>
              (shown before · in hook)
            </small>
          </label>
          <input
            className="form-input"
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            placeholder="E-commerce, Banking, Fintech…"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Period</label>
          <input
            className="form-input"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            placeholder="Aug 2024 – Present"
          />
        </div>
      </div>

      {/* ── Card highlights ─────────────────────────────────── */}
      <p className="proj-form-section-label" style={{ marginTop: '0.5rem' }}>Card highlights</p>

      <div className="form-group">
        <label className="form-label">
          Top Metric
          <small style={{ color: 'var(--color-success)', marginLeft: '0.35rem' }}>
            ← shown green on card (MOST IMPORTANT)
          </small>
        </label>
        <input
          className="form-input"
          value={form.topMetric}
          onChange={(e) => setForm({ ...form, topMetric: e.target.value })}
          placeholder="100% pricing accuracy across all substrate sizes"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Tech / Testing Tags
          <small style={{ color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>(comma-separated)</small>
        </label>
        <input
          className="form-input"
          value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })}
          placeholder="Automation, Jenkins, API, Performance"
        />
      </div>

      {/* ── Panel content ───────────────────────────────────── */}
      <p className="proj-form-section-label" style={{ marginTop: '0.5rem' }}>Side panel content</p>

      <RichTextEditor
        label="Project Overview *"
        value={form.description}
        onChange={(val) => setForm({ ...form, description: val })}
        placeholder="2-3 sentence overview shown in the detail panel…"
        minHeight={120}
      />
      {errors.description && <span className="form-error" style={{ marginTop: '-0.75rem', display: 'block' }}>{errors.description}</span>}

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label className="form-label">
          Key Achievements
          <small style={{ color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>
            (one per line — metric numbers get highlighted green automatically)
          </small>
        </label>
        <textarea
          className="form-textarea"
          rows={5}
          value={form.achievements}
          onChange={(e) => setForm({ ...form, achievements: e.target.value })}
          placeholder={`Verified materials cost engine — 100% pricing accuracy across premium substrates\nOptimized custom order workflows — manufacturing defects down 60%\nBoundary and tax validation ensuring 100% material pricing accuracy`}
        />
      </div>

      {/* ── Links ──────────────────────────────────────────── */}
      <p className="proj-form-section-label" style={{ marginTop: '0.5rem' }}>Footer links</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Test Report URL</label>
          <input
            className={`form-input${errors.testReportUrl ? ' input-error' : ''}`}
            value={form.testReportUrl}
            onChange={(e) => setForm({ ...form, testReportUrl: e.target.value })}
            placeholder="https://..."
          />
          {errors.testReportUrl && <span className="form-error">{errors.testReportUrl}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">GitHub URL</label>
          <input
            className={`form-input${errors.githubUrl ? ' input-error' : ''}`}
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
          {errors.githubUrl && <span className="form-error">{errors.githubUrl}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Live URL</label>
          <input
            className={`form-input${errors.liveUrl ? ' input-error' : ''}`}
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            placeholder="https://..."
          />
          {errors.liveUrl && <span className="form-error">{errors.liveUrl}</span>}
        </div>
      </div>

      {/* ── Visuals & Meta ─────────────────────────────────── */}
      <p className="proj-form-section-label" style={{ marginTop: '0.5rem' }}>Visuals & Meta</p>

      <ImageUpload
        label="Project Thumbnail / Logo"
        value={form.imageUrl}
        onChange={(url) => setForm({ ...form, imageUrl: url })}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Image URL Override</label>
          <input
            className="form-input"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://... (optional)"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Order</label>
          <input
            type="number"
            className="form-input"
            value={form.order}
            min={0}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
        <input
          type="checkbox"
          id="proj-featured"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
        />
        <label htmlFor="proj-featured" className="form-label" style={{ margin: 0 }}>
          Featured project <small style={{ color: 'var(--color-accent)' }}>(shows info border + dot on card)</small>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <style>{`
        .input-error { border-color: var(--color-error) !important; }
        .proj-form-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 0.85rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--color-border);
        }
      `}</style>
    </form>
  );
}
