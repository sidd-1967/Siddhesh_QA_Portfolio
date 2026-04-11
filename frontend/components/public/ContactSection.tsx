'use client';
import { useState, useRef, useEffect } from 'react';
import { publicAPI } from '@/lib/api';
import { AppConfig } from '@/config/app.config';

interface Profile {
  email: string;
  phone?: string;
  location: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactSection({ profile, config }: { profile: Profile | null, config?: any }) {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Load reCAPTCHA script if enabled
  useEffect(() => {
    if (!AppConfig.recaptcha.enabled || !AppConfig.recaptcha.siteKey) return;
    if (document.getElementById('recaptcha-script')) return;
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${AppConfig.recaptcha.siteKey}`;
    document.head.appendChild(script);
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    try {
      let recaptchaToken = 'disabled';

      if (AppConfig.recaptcha.enabled && AppConfig.recaptcha.siteKey && window.grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve) => {
          window.grecaptcha!.ready(async () => {
            const token = await window.grecaptcha!.execute(AppConfig.recaptcha.siteKey, { action: 'contact' });
            resolve(token);
          });
        });
      }

      await publicAPI.submitContact({ ...form, recaptchaToken });
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMsg(axiosErr?.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">Get In Touch</span>
          <h2 className="section-title fade-in delay-1">Contact Me</h2>
          <p className="section-desc fade-in delay-2">
            Have a project in mind or want to discuss QA? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div className="contact-info fade-in delay-1">
            <h3 className="contact-info-title">Let&apos;s Connect</h3>
            <p className="contact-info-text">
              Feel free to reach out for collaboration, job opportunities, or just to say hi!
            </p>

            <div className="contact-methods">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="contact-method">
                  <div className="contact-method-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="contact-method-label">Email</span>
                    <span className="contact-method-value">{profile.email}</span>
                  </div>
                </a>
              )}
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="contact-method">
                  <div className="contact-method-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="contact-method-label">Phone</span>
                    <span className="contact-method-value">{profile.phone}</span>
                  </div>
                </a>
              )}
              {profile?.location && (
                <div className="contact-method">
                  <div className="contact-method-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="contact-method-label">Location</span>
                    <span className="contact-method-value">{profile.location}</span>
                  </div>
                </div>
              )}
            </div>

            {profile?.socialLinks && (
              <div className="contact-socials">
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="contact-social-link" aria-label="LinkedIn">
                    LinkedIn
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="contact-social-link" aria-label="GitHub">
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Form */}
          <div className="contact-form-wrap fade-in delay-2">
            {status === 'success' ? (
              <div className="contact-success">
                <div className="contact-success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I&apos;ll get back to you soon.</p>
                <button className="btn btn-outline" onClick={() => setStatus('idle')} style={{ marginTop: '1rem' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      className={`form-input${errors.name ? ' input-error' : ''}`}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      className={`form-input${errors.email ? ' input-error' : ''}`}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">Subject *</label>
                  <input
                    id="contact-subject"
                    type="text"
                    className={`form-input${errors.subject ? ' input-error' : ''}`}
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                  {errors.subject && <span className="form-error">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    className={`form-textarea${errors.message ? ' input-error' : ''}`}
                    placeholder="Tell me more..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                {status === 'error' && (
                  <div className="contact-error">{errorMsg}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  id="contact-submit-btn"
                  disabled={status === 'loading'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {AppConfig.recaptcha.enabled && (
                  <p className="recaptcha-notice">
                    Protected by reCAPTCHA. Google{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>{' '}
                    &amp;{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms</a>.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .contact-info-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .contact-info-text {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .contact-methods { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .contact-method {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
          padding: 1rem;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);
        }
        .contact-method:hover {
          border-color: var(--color-accent);
          transform: translateX(4px);
        }
        .contact-method-icon {
          width: 44px; height: 44px;
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.15);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-accent);
          flex-shrink: 0;
        }
        .contact-method-label { display: block; font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.15rem; }
        .contact-method-value { font-size: 0.9rem; font-weight: 500; color: var(--color-text-primary); }
        .contact-socials { display: flex; gap: 0.75rem; }
        .contact-social-link {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .contact-social-link:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
          background: rgba(0,212,255,0.05);
        }
        .contact-form-wrap {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
        }
        .contact-form { display: flex; flex-direction: column; gap: 0; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .input-error { border-color: var(--color-error) !important; }
        .contact-error {
          background: rgba(255,107,107,0.1);
          border: 1px solid rgba(255,107,107,0.3);
          color: var(--color-error);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .contact-success {
          text-align: center;
          padding: 3rem 1rem;
        }
        .contact-success-icon {
          width: 64px; height: 64px;
          background: rgba(34,211,165,0.15);
          border: 2px solid var(--color-success);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem;
          color: var(--color-success);
          margin: 0 auto 1.5rem;
        }
        .contact-success h3 { font-size: 1.4rem; margin-bottom: 0.5rem; }
        .contact-success p { color: var(--color-text-secondary); }
        .recaptcha-notice {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-align: center;
          margin-top: 0.75rem;
        }
        .recaptcha-notice a { color: var(--color-accent); }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
