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
  location?: string;
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
      { threshold: 0.06 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [education, certifications]);

  return (
    <div ref={ref}>
      {/* ── Education ─────────────────────────────────────────────────── */}
      {config?.education?.enabled !== false && (
        <section id="education" className="section section-alt">
          <div className="container">
            <div className="section-header">
              <span className="section-tag fade-in">{config?.education?.title || 'Background'}</span>
              <h2 className="section-title fade-in delay-1">{config?.education?.subtitle || 'Education'}</h2>
            </div>

            {education.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No education added.</p>
            ) : (
              <div className="edu-timeline">
                {education.map((edu, i) => {
                  return (
                    <div
                      key={edu._id}
                      className={`edu-timeline-item fade-in delay-${Math.min(i + 1, 4)}`}
                    >
                      {/* connector */}
                      <div className="edu-connector">
                        <div className="edu-dot" />
                        {i < education.length - 1 && <div className="edu-line" />}
                      </div>

                      {/* card */}
                      <div className="edu-card card">
                        {/* top: date pill */}
                        <div className="edu-date-pill">
                          {edu.startYear} – {edu.endYear || 'Present'}
                        </div>

                        {/* header row: logo + info */}
                        <div className="edu-card-header">
                          <div className="edu-thumbnail">
                            {edu.logoUrl ? (
                              <Image
                                src={edu.logoUrl}
                                alt={edu.institution}
                                width={80}
                                height={80}
                                style={{ objectFit: 'contain', borderRadius: 6 }}
                              />
                            ) : (
                              <span className="edu-thumb-fallback">
                                {edu.institution.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="edu-card-info">
                            {/* hook line */}
                            <p className="edu-hook">
                              {edu.degree}
                              {edu.field && <> · <span style={{ fontWeight: 400 }}>{edu.field}</span></>}
                            </p>

                            {/* institution name */}
                            <p className="edu-institution">{edu.institution}</p>

                            {/* location */}
                            {edu.location && (
                              <p className="edu-location">{edu.location}</p>
                            )}

                            {/* grade — top metric, green */}
                            {edu.grade && (
                              <p className="edu-grade-metric">
                                <span className="edu-grade-dot" />
                                {edu.grade}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Certifications ────────────────────────────────────────────── */}
      {config?.certifications?.enabled !== false && (
        <section id="certifications" className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag fade-in">{config?.certifications?.title || 'Credentials'}</span>
              <h2 className="section-title fade-in delay-1">{config?.certifications?.subtitle || 'Certifications'}</h2>
            </div>

            <div className="cert-grid fade-in delay-2">
              {certifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>
                  No certifications added.
                </p>
              ) : (
                certifications.map((cert) => (
                  <div key={cert._id} className="cert-card card">
                    {/* thumbnail row */}
                    <div className="cert-thumb-row">
                      <div
                        className="cert-badge"
                        style={{
                          background: `${getIssuerColor(cert.issuer)}18`,
                          border: `1px solid ${getIssuerColor(cert.issuer)}33`,
                        }}
                      >
                        {cert.badgeUrl ? (
                          <Image
                            src={cert.badgeUrl}
                            alt={cert.name}
                            width={52}
                            height={52}
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke={getIssuerColor(cert.issuer)}
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        )}
                      </div>
                      <span className="cert-issuer" style={{ color: getIssuerColor(cert.issuer) }}>
                        {cert.issuer}
                      </span>
                    </div>

                    {/* period */}
                    <p className="cert-period">
                      {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {cert.expiryDate &&
                        ` – ${new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    </p>

                    {/* cert name — hook */}
                    <h3 className="cert-name">{cert.name}</h3>

                    {cert.credentialId && (
                      <p className="cert-id">ID: {cert.credentialId}</p>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-link"
                      >
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
        /* ── Education Timeline ─────────────────────────────────────── */
        .edu-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 800px;
          margin: 0 auto;
        }
        .edu-timeline-item {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 1.25rem;
          position: relative;
        }

        /* connector */
        .edu-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1.6rem;
        }
        .edu-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid var(--color-accent);
          background: var(--color-bg-2);
          box-shadow: 0 0 10px rgba(0,212,255,0.35);
          flex-shrink: 0;
          z-index: 1;
        }
        .edu-line {
          width: 2px;
          flex: 1;
          min-height: 1.5rem;
          margin-top: 6px;
          background: linear-gradient(to bottom, rgba(0,212,255,0.3), transparent);
        }

        /* card */
        .edu-card {
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: var(--radius-xl);
          position: relative;
          min-width: 0;
          transition: all 0.3s ease;
        }
        .edu-card:hover {
          border-color: rgba(0,212,255,0.25);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
          transform: translateY(-3px);
        }

        /* date pill at top */
        .edu-date-pill {
          display: inline-flex;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-accent);
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: var(--radius-full);
          padding: 0.25rem 0.75rem;
          margin-bottom: 1rem;
        }

        /* header: thumbnail + info */
        .edu-card-header {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        /* thumbnail */
        .edu-thumbnail {
          flex-shrink: 0;
          width: 90px; height: 90px;
          background: rgba(255,255,255,0.07);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .edu-thumb-fallback {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--color-accent);
          font-family: var(--font-heading);
        }

        /* info */
        .edu-card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.2rem; }

        /* hook line — degree · field */
        .edu-hook {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        /* institution — accent color */
        .edu-institution {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-accent);
        }

        /* location */
        .edu-location {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        /* grade — top metric, success green */
        .edu-grade-metric {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-success);
          margin-top: 0.35rem;
        }
        .edu-grade-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--color-success);
          flex-shrink: 0;
        }

        /* description */
        .edu-desc {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-top: 1rem;
          padding: 0;
          border: none;
          background: none;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }
        .edu-desc--open {
          max-height: 600px;
          opacity: 1;
        }
        .edu-desc ul, .edu-desc ol { padding-left: 1.25rem; margin-bottom: 0.25rem; }
        .edu-desc li { margin-bottom: 0.2rem; }
        .edu-desc p { margin-bottom: 0.25rem; }
        .edu-desc strong { color: var(--color-text-primary); }

        /* expand button */
        .edu-expand-btn {
          display: inline-block;
          margin-top: 0.85rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-accent);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .edu-expand-btn:hover { opacity: 0.75; }

        /* ── Certifications ─────────────────────────────────────────── */
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .cert-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .cert-thumb-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }
        .cert-badge {
          width: 64px; height: 64px;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cert-issuer {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .cert-period {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .cert-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.4;
        }
        .cert-id {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          font-family: monospace;
        }
        .cert-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-accent);
          text-decoration: none;
          margin-top: auto;
          padding-top: 0.65rem;
          border-top: 1px solid var(--color-border);
        }
        .cert-link:hover { text-decoration: underline; }

        /* mobile */
        @media (max-width: 640px) {
          .edu-timeline-item {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .edu-connector { display: none; }
          .edu-card { margin-bottom: 1rem; padding: 1.25rem; }
        }
      `}</style>
    </div>
  );
}
