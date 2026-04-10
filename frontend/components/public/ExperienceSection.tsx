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

function formatDate(dateStr: string | null | undefined, current?: boolean): string {
  if (current || !dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ExperienceSection({ experience, config }: { experience: Experience[], config?: any }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.fade-in, .timeline-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [experience]);

  return (
    <section id="experience" className="section section-alt" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || "Work History"}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || "Experience"}</h2>
        </div>

        {experience.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No experience added yet.</p>
        ) : (
          <div className="timeline">
            {experience.map((exp, i) => (
              <div
                key={exp._id}
                className={`timeline-item fade-in delay-${Math.min(i + 1, 5)}`}
              >
                <div className="timeline-dot">
                  <div className="timeline-dot-inner" />
                </div>
                <div className="timeline-card card">
                  <div className="exp-header">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {exp.companyLogo ? (
                        <div className="exp-logo-wrap">
                          <img src={exp.companyLogo} alt={exp.company} className="exp-logo" />
                        </div>
                      ) : (
                        <div className="exp-logo-wrap fallback">
                          {exp.company.charAt(0)}
                        </div>
                      )}
                      <div className="exp-meta">
                        <h3 className="exp-role">{exp.role}</h3>
                        <div className="exp-company-row">
                          {exp.companyUrl ? (
                            <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="exp-company">
                              {exp.company}
                            </a>
                          ) : (
                            <span className="exp-company">{exp.company}</span>
                          )}
                          {exp.location && <span className="exp-location">· {exp.location}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="exp-dates">
                      <span>{formatDate(exp.startDate)}</span>
                      <span> – </span>
                      <span className={exp.current ? 'exp-current' : ''}>
                        {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                  <p className="exp-desc">{exp.description}</p>
                  {exp.techStack?.length > 0 && (
                    <div className="exp-tags">
                      {exp.techStack.map((t) => (
                        <span key={t} className="tag">{t}</span>
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
        .timeline { position: relative; padding-left: 2.5rem; }
        .timeline::before {
          content: ''; position: absolute; left: 11px; top: 0; bottom: 0;
          width: 2px; background: linear-gradient(to bottom, var(--color-accent), transparent);
        }
        .timeline-item { position: relative; margin-bottom: 2.5rem; }
        .timeline-dot {
          position: absolute; left: -2.5rem; top: 1.5rem;
          width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
        }
        .timeline-dot-inner {
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--color-accent); box-shadow: 0 0 12px var(--color-accent-glow);
          border: 2px solid var(--color-bg-2);
        }
        .timeline-card { padding: 1.75rem; border-radius: var(--radius-xl); }
        .exp-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 1.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .exp-logo-wrap {
          width: 50px; height: 50px; border-radius: 12px; overflow: hidden;
          background: white; display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--color-border); flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .exp-logo-wrap.fallback {
          background: var(--color-accent); color: white;
          font-weight: 800; font-size: 1.25rem;
        }
        .exp-logo { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
        .exp-role { font-size: 1.15rem; font-weight: 800; color: var(--color-text-primary); margin-bottom: 0.25rem; }
        .exp-company-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .exp-company { font-size: 0.95rem; color: var(--color-accent); font-weight: 600; text-decoration: none; }
        .exp-company:hover { text-decoration: underline; }
        .exp-location { font-size: 0.85rem; color: var(--color-text-muted); }
        .exp-dates { font-size: 0.85rem; color: var(--color-text-muted); white-space: nowrap; margin-top: 0.5rem; padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
        .exp-current { color: var(--color-success); font-weight: 700; }
        .exp-desc { font-size: 0.95rem; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.25rem; white-space: pre-line; }
        .exp-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      `}</style>
    </section>  );
}
