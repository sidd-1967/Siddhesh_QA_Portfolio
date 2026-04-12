'use client';
import { useState, useEffect, useRef } from 'react';
import { authAPI, adminAPI } from '@/lib/api';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'content' | 'email'>('content');

  // Security State
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState<Record<string, string>>({});

  // Content Config State
  const [config, setConfig] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  
  // Local string state for comma-separated inputs to prevent cursor jumping/deletion
  const [categoriesText, setCategoriesText] = useState('');

  // Email Template State
  const [template, setTemplate] = useState({ subject: '', body: '' });
  const [savedTemplate, setSavedTemplate] = useState({ subject: '', body: '' });
  const [templateLoading, setTemplateLoading] = useState(true);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    // Fetch Settings
    adminAPI.getSettings().then(res => {
      const data = res.data.data;
      setConfig(data);
      setCategoriesText(data.skillCategories.join(', '));
    }).finally(() => setConfigLoading(false));

    // Fetch Email Template
    adminAPI.getEmailTemplate().then(res => {
      setTemplate(res.data.data || { subject: '', body: '' });
      setSavedTemplate(res.data.data || { subject: '', body: '' });
    }).finally(() => setTemplateLoading(false));
  }, []);

  const updateEmailPreview = () => {
    if (!iframeRef.current || !template.body) return;

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
    if (activeTab === 'email') {
      updateEmailPreview();
    }
  }, [template.body, activeTab]);

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
    
    // Sync final text states to config before saving
    const finalConfig = {
      ...config,
      skillCategories: categoriesText.split(',').map(s => s.trim()).filter(Boolean)
    };
    
    try {
      await adminAPI.updateSettings(finalConfig);
      setConfig(finalConfig);
      showToast('success', 'Content configuration saved!');
    } catch {
      showToast('error', 'Failed to save configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const updateHeader = (section: string, field: 'title' | 'subtitle' | 'description' | 'infoTitle' | 'infoText' | 'enabled', val: any) => {
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

  // --- Email Logic ---
  const handleTemplateSave = async () => {
    setSavingTemplate(true);
    try {
      await adminAPI.updateEmailTemplate(template);
      setSavedTemplate(template);
      showToast('success', 'Email template saved successfully!');
    } catch {
      showToast('error', 'Failed to save email template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const isTemplateDirty = template.subject !== savedTemplate.subject || template.body !== savedTemplate.body;

  if (configLoading || templateLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Manage your portfolio configuration and security.</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn${activeTab === 'content' ? ' active' : ''}`} onClick={() => setActiveTab('content')}>Dynamic Content</button>
        <button className={`tab-btn${activeTab === 'security' ? ' active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
        <button className={`tab-btn${activeTab === 'email' ? ' active' : ''}`} onClick={() => setActiveTab('email')}>Email Template</button>
      </div>

      {activeTab === 'content' ? (
        <form onSubmit={handleConfigSubmit}>
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 className="section-title-sm">Section Titles & Subtitles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {config && Object.entries(config.sectionHeaders).map(([key, header]: [string, any]) => (
                <div key={key} className="config-group" style={{ marginBottom: key === 'contact' ? '1.5rem' : '0', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label className="config-label" style={{ margin: 0, color: 'var(--color-accent)' }}>{key.charAt(0).toUpperCase() + key.slice(1)} Section</label>
                    <label className="toggle-switch" title={`Toggle ${key} section visibility`}>
                      <input 
                        type="checkbox" 
                        checked={header.enabled !== false} 
                        onChange={(e) => updateHeader(key, 'enabled', e.target.checked)} 
                      />
                      <div className="toggle-slider"></div>
                    </label>
                  </div>
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
                    style={{ marginBottom: key === 'contact' ? '0.5rem' : '0' }}
                  />
                  {key === 'contact' && (
                    <>
                      <textarea
                        className="form-textarea"
                        value={header.description || ''}
                        onChange={(e) => updateHeader(key, 'description', e.target.value)}
                        placeholder="Section Description"
                        rows={2}
                        style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}
                      />
                      <input
                        className="form-input"
                        value={header.infoTitle || ''}
                        onChange={(e) => updateHeader(key, 'infoTitle', e.target.value)}
                        placeholder="Info Card Title (e.g. Let's Connect)"
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <textarea
                        className="form-textarea"
                        value={header.infoText || ''}
                        onChange={(e) => updateHeader(key, 'infoText', e.target.value)}
                        placeholder="Info Card Text"
                        rows={2}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 className="section-title-sm">About Section Stats Cards</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {config.aboutStats && config.aboutStats.map((stat: any, index: number) => (
                <div key={index} className="config-group" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <label className="config-label">Card {index + 1}</label>
                  <input
                    className="form-input"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...config.aboutStats];
                      newStats[index].label = e.target.value;
                      setConfig({ ...config, aboutStats: newStats });
                    }}
                    placeholder="Label (e.g. Projects Tested)"
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    className="form-input"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...config.aboutStats];
                      newStats[index].value = e.target.value;
                      setConfig({ ...config, aboutStats: newStats });
                    }}
                    placeholder="Value (e.g. 15+)"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 className="section-title-sm">Dropdown Options</h2>
            <div className="form-group">
              <label htmlFor="skillCategories" className="form-label">Skill Categories <small>(comma-separated)</small></label>
              <input
                id="skillCategories"
                name="skillCategories"
                className="form-input"
                value={categoriesText}
                onChange={(e) => setCategoriesText(e.target.value)}
                placeholder="Testing, Automation, Frameworks..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={savingConfig}>
              {savingConfig ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      ) : activeTab === 'security' ? (
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
      ) : (
        <div className="template-editor-layout">
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="section-title-sm">Contact Email Template</h2>
            <div className="form-group">
              <label className="form-label">Email Subject</label>
              <input
                className="form-input"
                value={template.subject}
                onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                placeholder="e.g. New Message: {{subject}}"
              />
              <p className="field-hint">Use <code>{'{{subject}}'}</code> to include the sender&apos;s subject.</p>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Email Body (HTML/CSS)</label>
              <textarea
                className="code-editor"
                value={template.body}
                onChange={(e) => setTemplate({ ...template, body: e.target.value })}
                placeholder="<html>...</html>"
              />
              <div style={{ marginTop: '0.75rem' }}>
                <span className="editor-hint">Available placeholders:</span>
                <div className="placeholder-chips">
                  <code>{'{{name}}'}</code> <code>{'{{email}}'}</code> <code>{'{{subject}}'}</code> <code>{'{{message}}'}</code> <code>{'{{year}}'}</code>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setTemplate(savedTemplate)} disabled={!isTemplateDirty || savingTemplate}>Discard</button>
              <button className="btn btn-primary" onClick={handleTemplateSave} disabled={!isTemplateDirty || savingTemplate}>
                {savingTemplate ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>

          <div className="preview-wrap">
            <span className="config-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Email Preview</span>
            <div className="preview-window">
              <iframe ref={iframeRef} title="Email Preview" className="preview-iframe" />
            </div>
          </div>
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

        /* Email Tab Styles */
        .template-editor-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
        .code-editor {
          width: 100%; min-height: 400px;
          background: #1e1e1e; color: #d4d4d4;
          font-family: monospace; font-size: 13px;
          padding: 1.25rem; border-radius: var(--radius-md);
          border: 1px solid var(--color-border); resize: vertical; line-height: 1.5;
        }
        .code-editor:focus { outline: none; border-color: var(--color-accent); }
        .field-hint { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.25rem; }
        .field-hint code { background: rgba(255,255,255,0.05); padding: 1px 3px; border-radius: 4px; color: var(--color-accent); }
        .editor-hint { font-size: 0.7rem; color: var(--color-text-muted); display: block; margin-bottom: 0.4rem; font-weight: 600; text-transform: uppercase; }
        .placeholder-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .placeholder-chips code {
          background: rgba(0,212,255,0.08); color: var(--color-accent);
          padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;
          border: 1px solid rgba(0,212,255,0.15);
        }
        .preview-window {
          background: #fff; border-radius: var(--radius-lg);
          border: 1px solid var(--color-border); overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1); height: 600px; display: flex;
        }
        .preview-iframe { width: 100%; height: 100%; border: none; }
        
        @media (max-width: 1024px) {
          .template-editor-layout { grid-template-columns: 1fr; }
          .preview-window { height: 500px; }
        }
      `}</style>
    </div>
  );
}

