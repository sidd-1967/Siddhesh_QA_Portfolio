'use client';
import { useState, useEffect, useRef } from 'react';
import { adminAPI } from '@/lib/api';

export default function EmailTemplatePage() {
  const [template, setTemplate] = useState({ subject: '', body: '' });
  const [savedTemplate, setSavedTemplate] = useState({ subject: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      const res = await adminAPI.getEmailTemplate();
      setTemplate(res.data.data || { subject: '', body: '' });
      setSavedTemplate(res.data.data || { subject: '', body: '' });
    } catch {
      showToast('error', 'Failed to fetch email template');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateEmailTemplate(template);
      setSavedTemplate(template);
      showToast('success', 'Email template saved successfully!');
    } catch {
      showToast('error', 'Failed to save email template');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setTemplate(savedTemplate);
    showToast('success', 'Changes discarded');
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    const placeholders: Record<string, string> = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Collaboration Inquiry',
      message: 'Hello, I really liked your QA portfolio! Let\'s talk about some projects.',
      year: new Date().getFullYear().toString(),
    };

    let content = template.body;
    Object.entries(placeholders).forEach(([key, val]) => {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    });

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();
    }
  };

  useEffect(() => {
    updatePreview();
  }, [template.body]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  const isDirty = template.subject !== savedTemplate.subject || template.body !== savedTemplate.body;

  return (
    <div className="template-page">
      <div className="template-header">
        <div>
          <h1 className="template-title">Contact Email Template</h1>
          <p className="template-subtitle">Customize the HTML email you receive when someone submits the contact form.</p>
        </div>
        <div className="template-actions">
          <button className="btn btn-outline" onClick={handleDiscard} disabled={!isDirty || saving}>Discard</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!isDirty || saving}>
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>

      <div className="template-grid">
        {/* Editor */}
        <div className="template-editor-wrap">
          <div className="editor-group">
            <label className="editor-label">Email Subject</label>
            <input
              className="form-input"
              value={template.subject}
              onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
              placeholder="e.g. New Message: {{subject}}"
            />
            <p className="field-hint">Use <code>{'{{subject}}'}</code> to include the sender&apos;s subject.</p>
          </div>

          <div className="editor-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="editor-label">Email Body (HTML/CSS)</label>
            <textarea
              className="code-editor"
              value={template.body}
              onChange={(e) => setTemplate({ ...template, body: e.target.value })}
              placeholder="<html>...</html>"
            />
            <div className="editor-footer">
              <span className="editor-hint">Available placeholders:</span>
              <div className="placeholder-chips">
                <code>{'{{name}}'}</code> <code>{'{{email}}'}</code> <code>{'{{subject}}'}</code> <code>{'{{message}}'}</code> <code>{'{{year}}'}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="template-preview-wrap">
          <div className="preview-label">Live Preview</div>
          <div className="preview-window">
             <iframe ref={iframeRef} title="Email Preview" className="preview-iframe" />
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        .template-page { display: flex; flex-direction: column; height: calc(100vh - 4rem); min-height: 500px; }
        .template-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-shrink: 0; }
        .template-title { fontSize: 1.75rem; fontWeight: 800; margin-bottom: 0.25rem; }
        .template-subtitle { color: var(--color-text-secondary); fontSize: 0.9rem; }
        .template-actions { display: flex; gap: 0.75rem; }
        
        .template-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; flex: 1; min-height: 0; }
        
        .template-editor-wrap { display: flex; flex-direction: column; gap: 1.5rem; min-height: 0; }
        .editor-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .editor-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.05em; }
        .field-hint { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.25rem; }
        .field-hint code { background: rgba(255,255,255,0.05); padding: 2px 4px; border-radius: 4px; color: var(--color-accent); }
        
        .code-editor {
          flex: 1;
          width: 100%;
          min-height: 300px;
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: 'Fira Code', 'Cascadia Code', 'Ubuntu Mono', monospace;
          font-size: 14px;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          resize: none;
          line-height: 1.5;
          tab-size: 4;
        }
        .code-editor:focus { outline: none; border-color: var(--color-accent); }
        
        .editor-footer { margin-top: 0.75rem; }
        .editor-hint { font-size: 0.75rem; color: var(--color-text-muted); display: block; margin-bottom: 0.5rem; }
        .placeholder-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .placeholder-chips code {
          background: rgba(0,212,255,0.1);
          color: var(--color-accent);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          border: 1px solid rgba(0,212,255,0.2);
        }

        .template-preview-wrap { display: flex; flex-direction: column; gap: 0.5rem; min-height: 0; }
        .preview-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.05em; }
        .preview-window {
          flex: 1;
          background: #fff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          display: flex;
        }
        .preview-iframe { width: 100%; height: 100%; border: none; }

        @media (max-width: 1024px) {
          .template-grid { grid-template-columns: 1fr; overflow-y: auto; height: auto; }
          .template-page { height: auto; }
          .code-editor { min-height: 400px; }
          .preview-window { min-height: 500px; }
        }
      `}</style>
    </div>
  );
}
