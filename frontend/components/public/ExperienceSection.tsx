'use client';
import { useEffect, useRef } from 'react';

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

export default function ExperienceSection({ experience, config }: { experience: Experience[], config?: any }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.06 }
    );
    ref.current?.querySelectorAll('.fade-in, .timeline-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [experience]);

  return (
    <section id="experience" className="section section-alt" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || 'Work History'}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || 'Experience'}</h2>
        </div>

        {experience.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No experience added yet.</p>
        ) : (
          <div className="timeline">
            {experience.map((exp, i) => (
              <div key={exp._id} className={`timeline-item fade-in delay-${Math.min(i + 1, 5)}`}>
                {/* Timeline connector */}
                <div className="timeline-connector">
                  <div className={`tl-dot${exp.current ? ' tl-dot--current' : ''}`}>
                    <div className="tl-dot-inner" />
                  </div>
                  {i < experience.length - 1 && <div className="tl-line" />}
                </div>

                {/* Card */}
                <div className={`exp-card card${exp.current ? ' exp-card--current' : ''}`}>
                  {exp.current && <div className="exp-current-banner">Current Position</div>}

                  {/* Header Row */}
                  <div className="exp-header">
                    <div className="exp-logo-col">
                      {exp.companyLogo ? (
                        <img src={exp.companyLogo} alt={exp.company} className="exp-logo" />
                      ) : (
                        <div className="exp-logo exp-logo--fallback">
                          {exp.company.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="exp-title-col">
                      <h3 className="exp-role">{exp.role}</h3>
                      <div className="exp-company-row">
                        {exp.companyUrl ? (
                          <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="exp-company">
                            {exp.company}
                          </a>
                        ) : (
                          <span className="exp-company exp-company--text">{exp.company}</span>
                        )}
                        {exp.location && (
                          <>
                            <span className="exp-dot">·</span>
                            <span className="exp-location">{exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="exp-date-badge">
                      <span className="exp-date-from">{formatDate(exp.startDate)}</span>
                      <span className="exp-date-sep">–</span>
                      <span className={`exp-date-to${exp.current ? ' exp-date-to--present' : ''}`}>
                        {exp.current ? 'Present' : formatDate(exp.endDate, true)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <div
                      className="exp-desc ql-editor"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}

                  {/* Tech Stack */}
                  {exp.techStack?.length > 0 && (
                    <div className="exp-tags">
                      {exp.techStack.map((t) => (
                        <span key={t} className="exp-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* Timeline layout */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-left: 0;
          position: relative;
        }
        .timeline-item {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 1.25rem;
          position: relative;
        }

        /* Connector */
        .timeline-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1.75rem;
        }
        .tl-dot {
          width: 20px; height: 20px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--color-bg-2);
          border: 2px solid var(--color-border);
          flex-shrink: 0;
          z-index: 1;
        }
        .tl-dot--current {
          border-color: var(--color-accent);
          box-shadow: 0 0 12px rgba(0,212,255,0.4);
        }
        .tl-dot-inner {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-text-muted);
        }
        .tl-dot--current .tl-dot-inner {
          background: var(--color-accent);
        }
        .tl-line {
          width: 2px;
          flex: 1;
          min-height: 2rem;
          background: linear-gradient(to bottom, var(--color-border), transparent);
          margin-top: 6px;
        }

        /* Card */
        .exp-card {
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          min-width: 0;     /* critical: prevents grid child from overflowing 1fr column */
          width: 100%;
        }
        .exp-card--current {
          border-color: rgba(0,212,255,0.2);
          background: linear-gradient(135deg, rgba(0,212,255,0.04) 0%, rgba(255,255,255,0.04) 100%);
        }
        .exp-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0,212,255,0.25);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }

        /* Current banner */
        .exp-current-banner {
          position: absolute;
          top: 0; right: 0;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-2));
          color: var(--color-bg);
          padding: 0.25rem 1rem;
          border-radius: 0 var(--radius-xl) 0 var(--radius-md);
        }

        /* Header */
        .exp-header {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .exp-logo-col { flex-shrink: 0; }
        .exp-logo {
          width: 48px; height: 48px;
          border-radius: 12px;
          object-fit: contain;
          background: white;
          padding: 4px;
          border: 1px solid var(--color-border);
        }
        .exp-logo--fallback {
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
          color: var(--color-bg);
          font-size: 1.25rem;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          padding: 0;
        }

        .exp-title-col { flex: 1; min-width: 0; }
        .exp-role {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: 0.3rem;
          line-height: 1.3;
        }
        .exp-company-row {
          display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;
        }
        .exp-company {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-accent);
          text-decoration: none;
        }
        .exp-company:hover { text-decoration: underline; }
        .exp-company--text { color: var(--color-accent); }
        .exp-dot { color: var(--color-text-muted); }
        .exp-location { font-size: 0.85rem; color: var(--color-text-muted); }

        /* Date badge */
        .exp-date-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          color: var(--color-text-muted);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.4rem 0.85rem;
          white-space: nowrap;
          height: fit-content;
          flex-shrink: 0;
        }
        .exp-date-sep { color: var(--color-border); }
        .exp-date-to--present {
          color: var(--color-success);
          font-weight: 700;
        }

        /* Description – rendered from rich-text editor HTML */
        .exp-desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.75;
          margin-bottom: 1.25rem;
          padding: 0;
          border: none;
          background: none;
          white-space: normal;
          overflow-wrap: break-word;
          min-width: 0;
        }
        .exp-desc ul, .exp-desc ol {
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .exp-desc li { margin-bottom: 0.3rem; }
        .exp-desc p { margin-bottom: 0.4rem; }
        .exp-desc strong { color: var(--color-text-primary); font-weight: 600; }
        .exp-desc em { font-style: italic; }
        .exp-desc a { color: var(--color-accent); }

        /* Tech tags */
        .exp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .exp-tag {
          display: inline-block;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(0,212,255,0.06);
          color: var(--color-text-secondary);
          border: 1px solid rgba(0,212,255,0.15);
          transition: all 0.2s;
        }
        .exp-tag:hover {
          background: rgba(0,212,255,0.12);
          color: var(--color-accent);
          border-color: rgba(0,212,255,0.3);
        }

        @media (max-width: 640px) {
          /* On mobile, collapse the timeline grid — show cards full-width */
          .timeline-item {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .timeline-connector { display: none; }
          .exp-card {
            padding: 1.25rem;
            margin-bottom: 1rem;
          }
          .exp-header { gap: 0.75rem; }
          .exp-date-badge {
            align-self: flex-start;
            font-size: 0.78rem;
            padding: 0.3rem 0.65rem;
          }
          .exp-role { font-size: 1rem; }
          .exp-desc { font-size: 0.85rem; }
          .exp-tag { font-size: 0.7rem; }
        }
      `}</style>
    </section>
  );
}

