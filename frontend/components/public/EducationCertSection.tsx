'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;
  grade?: string;
  description?: string;
  logoUrl?: string;
}

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

const issuerColors: Record<string, string> = {
  ISTQB: '#004B87',
  Udemy: '#A435F0',
  Postman: '#FF6C37',
  Google: '#4285F4',
  AWS: '#FF9900',
  Microsoft: '#00A4EF',
};

function getIssuerColor(issuer: string): string {
  const key = Object.keys(issuerColors).find((k) => issuer.includes(k));
  return key ? issuerColors[key] : '#00D4FF';
}

interface Props {
  education: Education[];
  certifications: Certification[];
  config?: {
    education?: any;
    certifications?: any;
  };
}

export default function EducationCertSection({ education, certifications, config }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [education, certifications]);

  return (
    <div ref={ref}>
      {/* Education */}
      {config?.education?.enabled !== false && (
        <section id="education" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tag fade-in">{config?.education?.title || "Background"}</span>
            <h2 className="section-title fade-in delay-1">{config?.education?.subtitle || "Education"}</h2>
          </div>

          <div className="edu-grid">
            {education.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>No education added.</p>
            ) : (
              education.map((edu, i) => (
                <div key={edu._id} className={`edu-card card fade-in delay-${Math.min(i + 1, 3)}`}>
                  <div className="edu-icon" aria-hidden="true">
                    {edu.logoUrl ? (
                      <Image src={edu.logoUrl} alt={edu.institution} width={40} height={40} style={{ objectFit: 'contain' }} />
                    ) : (
                      <svg width="28" height="28" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      </svg>
                    )}
                  </div>
                  <div className="edu-body">
                    <h3 className="edu-degree">{edu.degree}</h3>
                    <p className="edu-institution">{edu.institution}</p>
                    {edu.field && <p className="edu-field">{edu.field}</p>}
                    <div className="edu-meta">
                      <span>{edu.startYear} – {edu.endYear || 'Present'}</span>
                      {edu.grade && <span className="edu-grade">{edu.grade}</span>}
                    </div>
                    {edu.description && (
                      <div
                        className="edu-desc ql-editor"
                        dangerouslySetInnerHTML={{ __html: edu.description }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      )}

      {/* Certifications */}
      {config?.certifications?.enabled !== false && (
        <section id="certifications" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag fade-in">{config?.certifications?.title || "Credentials"}</span>
            <h2 className="section-title fade-in delay-1">{config?.certifications?.subtitle || "Certifications"}</h2>
          </div>

          <div className="cert-grid fade-in delay-2">
            {certifications.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>No certifications added.</p>
            ) : (
              certifications.map((cert) => (
                <div key={cert._id} className="cert-card card">
                  <div className="cert-top">
                    <div
                      className="cert-badge"
                      style={{ background: `${getIssuerColor(cert.issuer)}18`, border: `1px solid ${getIssuerColor(cert.issuer)}33` }}
                    >
                      {cert.badgeUrl ? (
                        <Image src={cert.badgeUrl} alt={cert.name} width={40} height={40} style={{ objectFit: 'contain' }} />
                      ) : (
                        <svg width="28" height="28" fill="none" stroke={getIssuerColor(cert.issuer)} strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="cert-issuer" style={{ color: getIssuerColor(cert.issuer) }}>{cert.issuer}</span>
                    </div>
                  </div>
                  <h3 className="cert-name">{cert.name}</h3>
                  <div className="cert-meta">
                    <span>Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    {cert.expiryDate && (
                      <span>· Expires {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    )}
                  </div>
                  {cert.credentialId && (
                    <p className="cert-id">ID: {cert.credentialId}</p>
                  )}
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="cert-link">
                      Verify Credential ↗
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        </section>
      )}

      <style>{`
        .edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .edu-card { display: flex; gap: 1.25rem; padding: 1.5rem; }
        .edu-icon {
          flex-shrink: 0;
          width: 52px; height: 52px;
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.15);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
        }
        .edu-body { display: flex; flex-direction: column; gap: 0.3rem; }
        .edu-degree { font-size: 1rem; font-weight: 700; color: var(--color-text-primary); }
        .edu-institution { font-size: 0.9rem; color: var(--color-accent); font-weight: 500; }
        .edu-field { font-size: 0.85rem; color: var(--color-text-secondary); }
        .edu-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.25rem; }
        .edu-grade { color: var(--color-success); font-weight: 600; }
        .edu-desc { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.5rem; padding: 0; border: none; background: none; overflow-wrap: break-word; }
        .edu-desc ul, .edu-desc ol { padding-left: 1.25rem; margin-bottom: 0.25rem; }
        .edu-desc li { margin-bottom: 0.2rem; }
        .edu-desc p { margin-bottom: 0.25rem; }
        .edu-desc strong { color: var(--color-text-primary); }

        .cert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }
        .cert-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .cert-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.25rem; }
        .cert-badge {
          width: 52px; height: 52px;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cert-issuer { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
        .cert-name { font-size: 0.95rem; font-weight: 600; color: var(--color-text-primary); line-height: 1.4; }
        .cert-meta { font-size: 0.78rem; color: var(--color-text-muted); }
        .cert-id { font-size: 0.75rem; color: var(--color-text-muted); font-family: monospace; }
        .cert-link {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-accent);
          text-decoration: none;
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-border);
        }
        .cert-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
