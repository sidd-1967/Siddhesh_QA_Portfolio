'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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

function formatDate(dateStr: string | null | undefined, isEndDate?: boolean): string {
  if (!dateStr) return isEndDate ? 'Present' : '';
  let date: Date;
  if (dateStr.includes('-') && dateStr.split('-').length === 2) {
    const [year, month] = dateStr.split('-');
    date = new Date(parseInt(year), parseInt(month) - 1, 1);
  } else {
    date = new Date(dateStr);
  }
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getDuration(startDate: string, endDate?: string | null, current?: boolean): string {
  const start = new Date(startDate);
  const end = current || !endDate ? new Date() : new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs > 0 && mos > 0) return `${yrs} yr ${mos} mos`;
  if (yrs > 0) return `${yrs} yr`;
  return `${mos} mos`;
}

export default function ExperienceSection({ experience, config }: { experience: Experience[], config?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.06 }
    );
    ref.current?.querySelectorAll('.fade-in, .xp-entry').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [experience]);

  return (
    <section id="experience" className="section section-alt" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || 'Professional Journey'}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || 'Work Experience'}</h2>
        </div>

        {experience.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No experience added yet.</p>
        ) : (
          <div className="xp-layout fade-in delay-2">
            {/* ── Left: Timeline navigator ── */}
            <div className="xp-timeline-nav">
              {experience.map((exp, i) => (
                <button
                  key={exp._id}
                  className={`xp-nav-item ${i === activeIdx ? 'xp-nav-item--active' : ''} ${exp.current ? 'xp-nav-item--current' : ''}`}
                  onClick={() => setActiveIdx(i)}
                >
                  <div className="xp-nav-dot-col">
                    <div className="xp-nav-dot" />
                    {i < experience.length - 1 && <div className="xp-nav-line" />}
                  </div>
                  <div className="xp-nav-info">
                    <span className="xp-nav-company">{exp.company}</span>
                    <span className="xp-nav-dates">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate, true)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* ── Right: Detail card ── */}
            <div className="xp-detail-panel">
              {experience.map((exp, i) => (
                <div
                  key={exp._id}
                  className={`xp-entry ${i === activeIdx ? 'xp-entry--active' : ''}`}
                >
                  {/* Header */}
                  <div className="xp-card-top">
                    <div className="xp-logo-wrap">
                      {exp.companyLogo ? (
                        <Image src={exp.companyLogo} alt={exp.company} className="xp-logo-img" width={56} height={56} />
                      ) : (
                        <div className="xp-logo-img xp-logo-fallback">
                          {exp.company.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="xp-meta">
                      <h3 className="xp-role">{exp.role}</h3>
                      <div className="xp-company-line">
                        {exp.companyUrl ? (
                          <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="xp-company-link">
                            {exp.company} <span className="xp-ext-icon">↗</span>
                          </a>
                        ) : (
                          <span className="xp-company-name">{exp.company}</span>
                        )}
                        {exp.location && (
                          <>
                            <span className="xp-sep">•</span>
                            <span className="xp-location">📍 {exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {exp.current && <span className="xp-current-badge">● Current</span>}
                  </div>

                  {/* Date strip */}
                  <div className="xp-date-strip">
                    <span className="xp-date-range">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate, true)}
                    </span>
                    <span className="xp-duration">{getDuration(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <div
                      className="xp-desc ql-editor"
                      dangerouslySetInnerHTML={{ __html: exp.description.replace(/&nbsp;|\u00A0/g, ' ') }}
                    />
                  )}

                  {/* Tech Stack */}
                  {exp.techStack?.length > 0 && (
                    <div className="xp-tech">
                      <span className="xp-tech-label">Tech Stack</span>
                      <div className="xp-tech-list">
                        {exp.techStack.map((t) => (
                          <span key={t} className="xp-tech-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Mobile/Tablet: Premium Cards ── */}
            <div className="xp-mob">
              {experience.map((exp, i) => (
                <div
                  key={exp._id}
                  className={`xp-mob-card fade-in delay-${Math.min(i + 1, 5)} ${exp.current ? 'xp-mob-card--current' : ''}`}
                >
                  {/* Left accent bar */}
                  <div className="xp-mob-accent" />

                  <div className="xp-mob-body">
                    {/* Current badge */}
                    {exp.current && (
                      <div className="xp-mob-now">
                        <span className="xp-mob-now-dot" />
                        Current Position
                      </div>
                    )}

                    {/* Company + Logo row */}
                    <div className="xp-mob-top">
                      <div className="xp-mob-logo-wrap">
                        {exp.companyLogo ? (
                          <Image src={exp.companyLogo} alt={exp.company} className="xp-mob-logo" width={48} height={48} />
                        ) : (
                          <div className="xp-mob-logo xp-mob-logo--fb">
                            {exp.company.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="xp-mob-titles">
                        <h3 className="xp-mob-role">{exp.role}</h3>
                        <div className="xp-mob-company-line">
                          {exp.companyUrl ? (
                            <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="xp-company-link">{exp.company}</a>
                          ) : (
                            <span className="xp-company-name">{exp.company}</span>
                          )}
                          {exp.location && (
                            <span className="xp-mob-loc">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date + Duration strip */}
                    <div className="xp-mob-date-strip">
                      <div className="xp-mob-date-range">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate, true)}
                      </div>
                      <span className="xp-mob-dur">{getDuration(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <div className="xp-desc ql-editor" dangerouslySetInnerHTML={{ __html: exp.description.replace(/&nbsp;|\u00A0/g, ' ') }} />
                    )}

                    {/* Tech Stack */}
                    {exp.techStack?.length > 0 && (
                      <div className="xp-mob-tech">
                        <span className="xp-mob-tech-label">Tech Stack</span>
                        <div className="xp-tech-list">
                          {exp.techStack.map((t) => (
                            <span key={t} className="xp-tech-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* ═══ Layout ═══════════════════════ */
        .xp-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2.5rem;
          align-items: flex-start;
        }
        .xp-mobile-stack { display: none; }

        /* ═══ Timeline Nav (Left sidebar) ═══ */
        .xp-timeline-nav {
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 100px;
        }
        .xp-nav-item {
          display: flex;
          gap: 1rem;
          padding: 0;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: all 0.3s ease;
          font-family: var(--font-body);
        }
        .xp-nav-dot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 0.2rem;
        }
        .xp-nav-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.12);
          background: var(--color-bg-2);
          flex-shrink: 0;
          transition: all 0.3s ease;
          position: relative;
        }
        .xp-nav-item--active .xp-nav-dot {
          border-color: var(--color-accent);
          background: var(--color-accent);
          box-shadow: 0 0 12px rgba(0,212,255,0.5);
        }
        .xp-nav-item--current .xp-nav-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(0,212,255,0.3);
          animation: xp-ping 2s ease-out infinite;
        }
        @keyframes xp-ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .xp-nav-line {
          width: 2px;
          flex: 1;
          min-height: 28px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
        }
        .xp-nav-item--active + .xp-nav-item .xp-nav-line,
        .xp-nav-item--active .xp-nav-line {
          background: linear-gradient(to bottom, rgba(0,212,255,0.3), rgba(255,255,255,0.03));
        }
        .xp-nav-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding-bottom: 1.5rem;
        }
        .xp-nav-company {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: color 0.3s;
        }
        .xp-nav-item--active .xp-nav-company {
          color: var(--color-text-primary);
        }
        .xp-nav-item:hover .xp-nav-company {
          color: var(--color-text-primary);
        }
        .xp-nav-dates {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--color-text-muted);
          letter-spacing: 0.02em;
        }

        /* ═══ Detail Panel ═════════════════ */
        .xp-detail-panel {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
        }
        .xp-entry {
          grid-area: 1 / 1 / 2 / 2;
          opacity: 0;
          visibility: hidden;
          transform: translateY(15px);
          transition: 
            opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            visibility 0.4s;
        }
        .xp-entry--active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          z-index: 1;
        }

        /* Card top */
        .xp-card-top {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .xp-logo-wrap {
          flex-shrink: 0;
        }
        .xp-logo-img {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          object-fit: contain;
          background: #fff;
          padding: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .xp-logo-fallback {
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
          color: #fff;
          font-size: 1.5rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .xp-meta { flex: 1; min-width: 0; }
        .xp-role {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.25;
          margin-bottom: 0.35rem;
          font-family: var(--font-heading);
        }
        .xp-company-line {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }
        .xp-company-link {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-accent);
          text-decoration: none;
          transition: color 0.2s;
        }
        .xp-company-link:hover { color: #fff; }
        .xp-ext-icon { font-size: 0.75rem; opacity: 0.6; }
        .xp-company-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-accent);
        }
        .xp-sep { color: var(--color-text-muted); font-size: 0.75rem; }
        .xp-location {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
        .xp-current-badge {
          flex-shrink: 0;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-success);
          background: rgba(34,211,165,0.1);
          border: 1px solid rgba(34,211,165,0.25);
          border-radius: var(--radius-full);
          padding: 0.3rem 0.85rem;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        /* Date strip */
        .xp-date-strip {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
        }
        .xp-date-range {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .xp-duration {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(0,212,255,0.08);
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(0,212,255,0.15);
        }

        /* Description */
        .xp-desc, .xp-desc * {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.8;
          margin-bottom: 1.5rem;
          padding: 0;
          border: none;
          background: none;
          white-space: normal;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: normal;
          min-width: 0;
        }
        .xp-desc ul, .xp-desc ol {
          padding-left: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .xp-desc li {
          margin-bottom: 0.4rem;
          position: relative;
        }
        .xp-desc li::marker {
          color: var(--color-accent);
        }
        .xp-desc p { margin-bottom: 0.5rem; }
        .xp-desc strong { color: var(--color-text-primary); font-weight: 600; }
        .xp-desc em { font-style: italic; }
        .xp-desc a { color: var(--color-accent); }

        /* Tech stack */
        .xp-tech {
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .xp-tech-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-text-muted);
          margin-bottom: 0.75rem;
        }
        .xp-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .xp-tech-tag {
          display: inline-block;
          padding: 0.3rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 500;
          background: rgba(0,212,255,0.06);
          color: var(--color-text-secondary);
          border: 1px solid rgba(0,212,255,0.12);
        }

        /* ═══ Mobile/Tablet Cards ═══════════ */
        .xp-mob { display: none; }

        .xp-mob-card {
          display: flex;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 1.5rem;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .xp-mob-card--current {
          border-color: rgba(0,212,255,0.2);
          background: linear-gradient(135deg, rgba(0,212,255,0.04), rgba(123,95,253,0.02), rgba(255,255,255,0.03));
        }

        /* Left accent bar */
        .xp-mob-accent {
          width: 4px;
          flex-shrink: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
        }
        .xp-mob-card--current .xp-mob-accent {
          background: linear-gradient(to bottom, var(--color-accent), var(--color-accent-2));
          box-shadow: 0 0 12px rgba(0,212,255,0.3);
        }

        .xp-mob-body {
          flex: 1;
          padding: 1.5rem;
          min-width: 0;
        }

        /* Current badge */
        .xp-mob-now {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-success);
          background: rgba(34,211,165,0.08);
          border: 1px solid rgba(34,211,165,0.2);
          border-radius: var(--radius-full);
          padding: 0.25rem 0.75rem;
          margin-bottom: 1rem;
        }
        .xp-mob-now-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-success);
          box-shadow: 0 0 6px rgba(34,211,165,0.5);
          animation: xp-ping-green 2s ease-out infinite;
        }
        @keyframes xp-ping-green {
          0% { box-shadow: 0 0 0 0 rgba(34,211,165,0.5); }
          100% { box-shadow: 0 0 0 8px rgba(34,211,165,0); }
        }

        /* Top: logo + titles */
        .xp-mob-top {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .xp-mob-logo-wrap { flex-shrink: 0; }
        .xp-mob-logo {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          object-fit: contain;
          background: #fff;
          padding: 5px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .xp-mob-logo--fb {
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
          color: #fff;
          font-size: 1.35rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .xp-mob-titles { flex: 1; min-width: 0; }
        .xp-mob-role {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin-bottom: 0.3rem;
          font-family: var(--font-heading);
        }
        .xp-mob-company-line {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .xp-mob-loc {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
        .xp-mob-loc svg {
          opacity: 0.5;
        }

        /* Date strip */
        .xp-mob-date-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.6rem 0.85rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
        }
        .xp-mob-date-range {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .xp-mob-date-range svg {
          color: var(--color-accent);
          opacity: 0.6;
          flex-shrink: 0;
        }
        .xp-mob-dur {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.15);
          border-radius: var(--radius-full);
          padding: 0.2rem 0.65rem;
          white-space: nowrap;
        }

        /* Tech in mobile */
        .xp-mob-tech {
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .xp-mob-tech-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-text-muted);
          margin-bottom: 0.6rem;
        }

        /* ═══ Responsive ═══════════════════ */
        @media (max-width: 860px) {
          .xp-layout {
            display: block;
          }
          .xp-timeline-nav,
          .xp-detail-panel {
            display: none;
          }
          .xp-mob {
            display: block;
          }
        }
        @media (max-width: 480px) {
          .xp-mob-body { padding: 1.15rem; }
          .xp-mob-role { font-size: 1rem; }
          .xp-mob-logo {
            width: 42px;
            height: 42px;
            border-radius: 12px;
          }
          .xp-mob-date-strip { padding: 0.5rem 0.7rem; }
          .xp-mob-date-range { font-size: 0.75rem; }
          .xp-mob-card { margin-bottom: 1.15rem; }
        }
      `}</style>
    </section>
  );
}
