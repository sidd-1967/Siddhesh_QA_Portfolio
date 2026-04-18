'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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
}

function highlightMetric(text: string) {
  // Bold any number/percentage/metric inside the string with success color
  return text.replace(
    /(\d+[\d,]*%?|\d+\/\d+|↑\d+|↓\d+|zero|100%|0\s+P\d+)/gi,
    '<strong class="metric-num">$1</strong>'
  );
}

export default function ProjectsSection({ projects, config }: { projects: Project[]; config?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);

  const VISIBLE_COUNT = 3;
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  // Featured first, then rest
  const sorted = [...featured, ...rest];
  const visible = showAll ? sorted : sorted.slice(0, VISIBLE_COUNT);
  const hidden = sorted.slice(VISIBLE_COUNT);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.06 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || 'Work'}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || 'Projects'}</h2>
        </div>

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No projects added yet.</p>
        ) : (
          <>
            {/* ── 3-col card grid ─────────────────────────────────── */}
            <div className="proj-grid">
              {visible.map((project, i) => (
                <article
                  key={project._id}
                  className={`proj-card card fade-in delay-${Math.min((i % 3) + 1, 5)}${project.featured ? ' proj-card--featured' : ''}`}
                  onClick={() => setActiveProject(project)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveProject(project)}
                  aria-label={`View details for ${project.title}`}
                >
                  {/* featured dot */}
                  {project.featured && <div className="proj-featured-dot" aria-hidden="true" />}

                  {/* ── thumbnail: company name banner ──────────── */}
                  <div className="proj-thumbnail">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.company || project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="proj-thumb-name">
                        {project.company || project.title}
                      </span>
                    )}
                  </div>

                  {/* ── card body ───────────────────────────────── */}
                  <div className="proj-card-body">
                    {/* hook line: domain · what it is */}
                    <p className="proj-hook">
                      {project.domain && <><span>{project.domain}</span> · </>}
                      {project.title}
                    </p>

                    {/* period */}
                    {project.period && (
                      <p className="proj-period">{project.period}</p>
                    )}

                    {/* top metric — most important, green */}
                    {project.topMetric && (
                      <p
                        className="proj-top-metric"
                        dangerouslySetInnerHTML={{ __html: highlightMetric(project.topMetric) }}
                      />
                    )}

                    {/* tags — testing types only */}
                    {project.techStack?.length > 0 && (
                      <div className="proj-tags">
                        {project.techStack.map((t) => (
                          <span key={t} className="proj-tag">{t}</span>
                        ))}
                      </div>
                    )}

                    {/* text link */}
                    <button className="proj-view-link" tabIndex={-1}>
                      View details →
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* ── "X more projects" bar ───────────────────────────── */}
            {hidden.length > 0 && (
              <div className="proj-more-bar fade-in delay-3">
                <div className="proj-more-info">
                  <span className="proj-more-count">{hidden.length} more project{hidden.length > 1 ? 's' : ''}</span>
                  <span className="proj-more-names">
                    {hidden.map((p) => p.company || p.title).join(', ')}
                  </span>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowAll((s) => !s)}>
                  {showAll ? 'Show less' : 'Show all'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Side drawer ──────────────────────────────────────────── */}
      {activeProject && (
        <>
          <div
            className="proj-overlay"
            onClick={() => setActiveProject(null)}
            aria-hidden="true"
          />
          <aside className="proj-drawer" role="dialog" aria-modal="true" aria-label="Project details">
            <button
              className="proj-drawer-close"
              onClick={() => setActiveProject(null)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* large banner / thumbnail */}
            <div className="proj-drawer-banner">
              {activeProject.imageUrl ? (
                <Image
                  src={activeProject.imageUrl}
                  alt={activeProject.company || activeProject.title}
                  fill
                  sizes="480px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span className="proj-drawer-banner-text">
                  {activeProject.company || activeProject.title}
                </span>
              )}
            </div>

            {/* drawer content */}
            <div className="proj-drawer-content">
              {/* company name + period + tags */}
              <h3 className="proj-drawer-company">
                {activeProject.company || activeProject.title}
              </h3>
              {activeProject.period && (
                <p className="proj-drawer-period">{activeProject.period}</p>
              )}
              {activeProject.techStack?.length > 0 && (
                <div className="proj-drawer-tags">
                  {activeProject.techStack.map((t) => (
                    <span key={t} className="proj-drawer-tag">{t}</span>
                  ))}
                </div>
              )}

              <div className="proj-drawer-divider" />

              {/* project overview */}
              {activeProject.description && (
                <div className="proj-drawer-section">
                  <p className="proj-drawer-label">Project overview</p>
                  <div
                    className="proj-drawer-overview ql-editor"
                    dangerouslySetInnerHTML={{ __html: activeProject.description }}
                  />
                </div>
              )}

              <div className="proj-drawer-divider" />

              {/* key achievements */}
              {activeProject.achievements && activeProject.achievements.length > 0 && (
                <div className="proj-drawer-section">
                  <p className="proj-drawer-label">Key achievements</p>
                  <ul className="proj-drawer-achievements">
                    {activeProject.achievements.map((ach, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: highlightMetric(ach) }}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* footer links */}
              {(activeProject.testReportUrl || activeProject.githubUrl || activeProject.liveUrl) && (
                <>
                  <div className="proj-drawer-divider" />
                  <div className="proj-drawer-footer">
                    {activeProject.testReportUrl && (
                      <a
                        href={activeProject.testReportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-footer-link"
                        id={`test-report-${activeProject._id}`}
                      >
                        Test report
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-footer-link"
                        id={`github-${activeProject._id}`}
                      >
                        GitHub
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-footer-link"
                        id={`live-${activeProject._id}`}
                      >
                        Live site ↗
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      <style>{`
        /* ── Card grid ──────────────────────────────────────────── */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 900px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .proj-grid { grid-template-columns: 1fr; } }

        /* ── Card ───────────────────────────────────────────────── */
        .proj-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .proj-card:hover {
          border-color: rgba(0,212,255,0.25);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
          transform: translateY(-4px);
        }
        .proj-card--featured {
          border-color: rgba(0,212,255,0.25);
          box-shadow: 0 0 30px rgba(0,212,255,0.06);
        }

        /* featured dot */
        .proj-featured-dot {
          position: absolute;
          top: 0.75rem; right: 0.75rem;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 8px rgba(0,212,255,0.7);
          z-index: 2;
        }

        /* thumbnail — 180px tall */
        .proj-thumbnail {
          height: 180px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid var(--color-border);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .proj-thumb-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          font-family: var(--font-heading);
          padding: 0 1rem;
          text-align: center;
          line-height: 1.3;
        }

        /* card body */
        .proj-card-body {
          padding: 1.1rem 1.2rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        /* hook line — 13px, primary, bold */
        .proj-hook {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.35;
        }
        .proj-hook span { color: var(--color-text-secondary); }

        /* period — 10px, muted */
        .proj-period {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        /* top metric — 11px, success color */
        .proj-top-metric {
          font-size: 0.75rem;
          color: var(--color-success);
          font-weight: 600;
          line-height: 1.4;
          margin-top: 0.1rem;
        }
        .proj-top-metric .metric-num {
          font-weight: 800;
        }

        /* tags */
        .proj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.3rem;
        }
        .proj-tag {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 500;
          background: rgba(0,212,255,0.07);
          color: var(--color-text-secondary);
          border: 1px solid rgba(0,212,255,0.15);
        }

        /* view details text link */
        .proj-view-link {
          display: inline-block;
          margin-top: auto;
          padding-top: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          padding-left: 0;
          text-align: left;
          transition: color 0.2s;
        }
        .proj-card:hover .proj-view-link { color: var(--color-accent); }

        /* ── More bar ───────────────────────────────────────────── */
        .proj-more-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 0.85rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          margin-top: 0.5rem;
        }
        .proj-more-info { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; min-width: 0; }
        .proj-more-count {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-primary);
          white-space: nowrap;
        }
        .proj-more-names {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 500px;
        }

        /* ── Overlay ────────────────────────────────────────────── */
        .proj-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          z-index: 400;
          animation: fadeOverlay 0.25s ease;
        }

        /* ── Side Drawer ────────────────────────────────────────── */
        .proj-drawer {
          position: fixed;
          top: 0; right: 0;
          width: min(480px, 100vw);
          height: 100dvh;
          background: #0d1526;
          border-left: 1px solid var(--color-border);
          z-index: 450;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          animation: slideInDrawer 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes slideInDrawer {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0); opacity: 1; }
        }

        .proj-drawer-close {
          position: absolute;
          top: 1rem; right: 1rem;
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: rgba(255,255,255,0.05);
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          z-index: 1;
          transition: all 0.2s;
        }
        .proj-drawer-close:hover {
          background: rgba(255,107,107,0.12);
          border-color: var(--color-error);
          color: var(--color-error);
        }

        /* drawer banner — 220px */
        .proj-drawer-banner {
          height: 220px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid var(--color-border);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .proj-drawer-banner-text {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--color-text-secondary);
          font-family: var(--font-heading);
          text-align: center;
          padding: 0 2rem;
          line-height: 1.3;
        }

        /* drawer content */
        .proj-drawer-content { padding: 1.75rem; flex: 1; }

        .proj-drawer-company {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: 0.3rem;
          line-height: 1.25;
        }
        .proj-drawer-period {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-bottom: 0.85rem;
        }
        .proj-drawer-tags {
          display: flex; flex-wrap: wrap; gap: 0.4rem;
          margin-bottom: 0.5rem;
        }
        .proj-drawer-tag {
          display: inline-block;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
          background: rgba(0,212,255,0.1);
          color: var(--color-accent);
          border: 1px solid rgba(0,212,255,0.25);
        }

        .proj-drawer-divider {
          height: 1px;
          background: var(--color-border);
          margin: 1.25rem 0;
        }

        /* sections inside drawer */
        .proj-drawer-section { margin-bottom: 0; }
        .proj-drawer-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 0.65rem;
        }

        /* overview */
        .proj-drawer-overview {
          font-size: 0.875rem;
          color: var(--color-text-primary);
          line-height: 1.7;
          padding: 0; border: none; background: none;
          overflow-wrap: break-word;
        }
        .proj-drawer-overview ul, .proj-drawer-overview ol { padding-left: 1.25rem; }
        .proj-drawer-overview li { margin-bottom: 0.2rem; }
        .proj-drawer-overview p { margin-bottom: 0.3rem; }
        .proj-drawer-overview strong { color: var(--color-text-primary); }

        /* achievements */
        .proj-drawer-achievements {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .proj-drawer-achievements li {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          padding-left: 1.1rem;
          position: relative;
        }
        .proj-drawer-achievements li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--color-success);
          font-weight: 700;
        }
        .proj-drawer-achievements li .metric-num {
          color: var(--color-success);
          font-weight: 700;
        }

        /* footer links */
        .proj-drawer-footer {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .proj-footer-link {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.1rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-primary);
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--color-border);
          text-decoration: none;
          transition: all 0.2s;
        }
        .proj-footer-link:hover {
          background: rgba(0,212,255,0.08);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        @media (max-width: 540px) {
          .proj-drawer { width: 100vw; }
          .proj-drawer-content { padding: 1.25rem; }
          .proj-more-names { display: none; }
        }
      `}</style>
    </section>
  );
}
