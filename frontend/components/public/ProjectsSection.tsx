'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { sanitizeHtml } from '@/lib/sanitize';

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
  role?: string;
  isCareerEngagement: boolean;
}

/** Escape HTML entities in plain text before inserting into HTML (prevents XSS). */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Wraps numeric metrics with a <strong> tag for visual emphasis.
 * Input text is HTML-escaped first to prevent XSS injection via topMetric/achievement values.
 */
function highlightMetric(text: string) {
  return escapeHtml(text).replace(
    /(\d+[\d,]*%?|\d+\/\d+|↑\d+|↓\d+|zero|100%|0\s+P\d+)/gi,
    '<strong class="pj-metric-num">$1</strong>'
  );
}

function ProjectIcon({ domain, title }: { domain?: string; title: string }) {
  const d = (domain || title).toLowerCase();
  if (d.includes('api') || d.includes('rest') || d.includes('postman')) {
    return (
      <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="rgba(0,212,255,0.12)" />
        <path d="M16 28h20M28 18l10 10-10 10" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="28" r="3" fill="#00D4FF"/>
      </svg>
    );
  }
  if (d.includes('selenium') || d.includes('automation') || d.includes('e2e') || d.includes('cypress') || d.includes('playwright')) {
    return (
      <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="rgba(123,95,253,0.12)" />
        <rect x="16" y="18" width="20" height="16" rx="3" stroke="#7B5FFD" strokeWidth="2.5"/>
        <path d="M20 26l3 3 6-6" stroke="#7B5FFD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (d.includes('performance') || d.includes('load') || d.includes('jmeter') || d.includes('k6')) {
    return (
      <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="26" fill="rgba(34,211,165,0.12)" />
        <path d="M16 38l6-10 5 5 5-12 5 7" stroke="#22D3A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (d.includes('mobile') || d.includes('appium') || d.includes('android') || d.includes('ios')) {
    return (
      <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="rgba(255,184,0,0.12)" />
        <rect x="20" y="14" width="12" height="24" rx="3" stroke="#FFB800" strokeWidth="2.5"/>
        <circle cx="26" cy="34" r="1.5" fill="#FFB800"/>
      </svg>
    );
  }
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill="rgba(0,212,255,0.10)" />
      <path d="M18 20h18M18 27h11M18 34h14" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="36" cy="34" r="4" stroke="#7B5FFD" strokeWidth="2"/>
      <path d="M34.2 34l1.5 1.5 2.3-2.3" stroke="#7B5FFD" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProjectsSection({ projects, config }: { projects: Project[]; config?: { title?: string; subtitle?: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showAllQA, setShowAllQA] = useState(false);
  const [activeCarouselDot, setActiveCarouselDot] = useState(0);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const cardW = (carouselRef.current.children[0] as HTMLElement)?.offsetWidth + 16;
    if (!cardW) return;
    const idx = Math.round(carouselRef.current.scrollLeft / cardW);
    setActiveCarouselDot(idx);
  };

  // Split projects into two groups
  const { builtProjects, careerProjects } = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      // featured first within each group
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
    return {
      builtProjects: sorted.filter(p => !p.isCareerEngagement),
      careerProjects: sorted.filter(p => p.isCareerEngagement),
    };
  }, [projects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [builtProjects, careerProjects]);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('pj-drawer-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('pj-drawer-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('pj-drawer-open');
    };
  }, [activeProject]);

  return (
    <section id="projects" ref={ref} className="section pj2-section">
      <div className="container">
        {/* ── Section Header ─────────────────────────────── */}
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || 'Portfolio'}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || 'Real-World Work'}</h2>
          <p className="section-desc fade-in delay-2">
            Apps I've designed and built as a tester, and the products I've helped ship quality across in my QA career.
          </p>
        </div>

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No projects added yet.</p>
        ) : (
          <>
            {/* ══════════════════════════════════════════════
                SECTION 1 — Built & Tested (case-cards)
            ══════════════════════════════════════════════ */}
            {builtProjects.length > 0 && (
              <>
                <div className="pj2-sub-head fade-in delay-2">
                  <h3 className="pj2-sub-title">Built &amp; Tested</h3>
                  <span className="pj2-count-tag">{builtProjects.length} PROJECT{builtProjects.length !== 1 ? 'S' : ''}</span>
                </div>
                <p className="pj2-sub-desc fade-in delay-3">
                  Full case studies for tools and apps I designed, built, and tested end-to-end.
                </p>

                <div className="pj2-case-carousel-wrap">
                  <div className="pj2-case-grid" ref={carouselRef} onScroll={handleCarouselScroll}>
                    {builtProjects.map((project, i) => (
                    <article
                      key={project._id}
                      className={`pj2-case-card fade-in delay-${(i % 3) + 1}${project.featured ? ' pj2-case-card--featured' : ''}`}
                      onClick={() => setActiveProject(project)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setActiveProject(project)}
                      aria-label={`View details for ${project.title}`}
                    >
                      {project.featured && <span className="pj2-featured-dot" aria-hidden="true" />}

                      {/* Thumbnail */}
                      <div className="pj2-thumb">
                        {project.imageUrl ? (
                          <div className="pj2-thumb-img-wrap">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              fill
                              className="pj2-thumb-img"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="pj2-thumb-fallback">
                            <ProjectIcon domain={project.domain} title={project.title} />
                            {project.company && (
                              <span className="pj2-thumb-name">{project.company}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="pj2-case-body">
                        {/* Meta row: domain tag + date */}
                        {(project.domain || project.period) && (
                          <div className="pj2-case-meta">
                            {project.domain && <span className="pj2-case-tag">{project.domain.toUpperCase()}</span>}
                            {project.period && <span className="pj2-case-date">{project.period}</span>}
                          </div>
                        )}

                        <h4 className="pj2-case-title">{project.title}</h4>
                        {project.company && <p className="pj2-case-client">{project.company}</p>}

                        {project.topMetric && (
                          <p
                            className="pj2-case-metric"
                            dangerouslySetInnerHTML={{ __html: highlightMetric(project.topMetric) }}
                          />
                        )}

                        {project.techStack && project.techStack.length > 0 && (
                          <div className="pj2-case-tags">
                            {project.techStack.slice(0, 4).map(tag => (
                              <span key={tag}>{tag}</span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className="pj2-tags-overflow">+{project.techStack.length - 4}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                  </div>
                  <div className="pj2-carousel-dots" aria-hidden="true">
                    {builtProjects.map((_, i) => (
                      <span key={i} className={i === activeCarouselDot ? 'active' : ''} />
                    ))}
                  </div>
                  <p className="pj2-carousel-hint" aria-hidden="true">Swipe for more →</p>
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════
                SECTION 2 — QA Career Engagements (qa-cards)
            ══════════════════════════════════════════════ */}
            {careerProjects.length > 0 && (
              <>
                <div className="pj2-section-gap" />

                <div className="pj2-sub-head fade-in">
                  <h3 className="pj2-sub-title">QA Career Engagements</h3>
                  <span className="pj2-count-tag">{careerProjects.length} PROJECT{careerProjects.length !== 1 ? 'S' : ''}</span>
                </div>
                <p className="pj2-sub-desc fade-in">
                  Products I've tested professionally across my QA career — process, coverage, and scale over deep narrative.
                </p>

                <div className={`pj2-qa-grid ${showAllQA ? 'expanded' : ''}`}>
                  {careerProjects.map((project, i) => {
                    const initial = (project.company || project.title).charAt(0).toUpperCase();
                    const subtitle = project.role || project.domain || '';
                    const isHidden = !showAllQA && i >= 6; // Hide after 6th on tablet/mobile
                    return (
                      <div key={project._id} className={`pj2-qa-card fade-in delay-${(i % 4) + 1}${isHidden ? ' hidden-row' : ''}`}>
                        <div className="pj2-qa-logo" aria-hidden="true">{initial}</div>
                        <div className="pj2-qa-name">{project.title}</div>
                        {subtitle && <div className="pj2-qa-role">{subtitle}</div>}
                      </div>
                    );
                  })}
                </div>
                {!showAllQA && careerProjects.length > 6 && (
                  <button className="pj2-show-all-btn fade-in" onClick={() => setShowAllQA(true)}>
                    Show all {careerProjects.length} projects ↓
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ── Side Drawer (case-cards only) ─────────────────── */}
      {activeProject && (
        <>
          <div className="pj2-overlay" onClick={() => setActiveProject(null)} />
          <aside className="pj2-drawer">
            <button className="pj2-close" onClick={() => setActiveProject(null)} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="pj2-drawer-body">
              <div className="pj2-drawer-hero">
                {activeProject.imageUrl ? (
                  <Image src={activeProject.imageUrl} alt={activeProject.title} fill className="pj2-drawer-img" />
                ) : (
                  <div className="pj2-drawer-placeholder">
                    <span>{activeProject.company?.charAt(0) || activeProject.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="pj2-drawer-main">
                <div className="pj2-drawer-header">
                  <div>
                    <span className="pj2-drawer-tag">{activeProject.domain || 'QA Project'}</span>
                    <h2 className="pj2-drawer-title">{activeProject.title}</h2>
                    {activeProject.company && <p className="pj2-drawer-company">{activeProject.company}</p>}
                  </div>
                  {activeProject.period && <span className="pj2-drawer-period">{activeProject.period}</span>}
                </div>

                <div className="pj2-drawer-section">
                  <h4 className="pj2-section-label">The Project</h4>
                  <div className="pj2-drawer-desc ql-editor" dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeProject.description) }} />
                </div>

                {activeProject.achievements && activeProject.achievements.length > 0 && (
                  <div className="pj2-drawer-section">
                    <h4 className="pj2-section-label">Key Outcomes</h4>
                    <ul className="pj2-achievements">
                      {activeProject.achievements.map((ach, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: highlightMetric(ach) }} />
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pj2-drawer-section">
                  <h4 className="pj2-section-label">Technology Used</h4>
                  <div className="pj2-tech-list">
                    {activeProject.techStack.map(t => <span key={t} className="pj2-tech-tag">{t}</span>)}
                  </div>
                </div>

                <div className="pj2-drawer-footer">
                  {activeProject.testReportUrl && (
                    <a href={activeProject.testReportUrl} target="_blank" rel="noopener noreferrer" className="pj2-action-btn pj2-action-btn--primary">Test Report ↗</a>
                  )}
                  {activeProject.githubUrl && (
                    <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="pj2-action-btn">GitHub</a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      <style>{`
        /* ── Section ──────────────────────────────────────── */
        .pj2-section { position: relative; overflow: hidden; }

        /* ── Sub-section header ───────────────────────────── */
        .pj2-sub-head {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin: 0 0 8px;
        }
        .pj2-sub-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-text-primary, #e8ecf6);
        }
        .pj2-count-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(var(--color-accent-rgb, 0,212,255), 0.1);
          border: 1px solid rgba(var(--color-accent-rgb, 0,212,255), 0.2);
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }
        .pj2-sub-desc {
          color: var(--color-text-muted);
          font-size: 0.875rem;
          margin: 0 0 1.75rem;
          max-width: 600px;
        }
        .pj2-section-gap { height: 4rem; }

        /* ══════════════════════════════════════════════
           CASE-CARD GRID
        ══════════════════════════════════════════════ */
        .pj2-case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-flow: dense;
          gap: 22px;
          margin-bottom: 2rem;
          align-items: start;
        }

        .pj2-case-card {
          background: var(--color-card, #0d1224);
          border: 1px solid var(--color-border, rgba(255,255,255,0.08));
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          outline: none;
        }
        @media (hover: hover) {
          .pj2-case-card:hover,
          .pj2-case-card:focus-visible {
            transform: translateY(-4px);
            border-color: rgba(var(--color-accent-rgb, 0,212,255), 0.4);
            box-shadow: 0 8px 32px rgba(var(--color-accent-rgb, 0,212,255), 0.12);
          }
        }
        .pj2-case-card--featured {
          border-color: rgba(var(--color-accent-rgb, 0,212,255), 0.3);
          box-shadow: 0 0 0 1px rgba(var(--color-accent-rgb, 0,212,255), 0.1) inset;
        }
        @media (hover: hover) {
          .pj2-case-card--featured:hover {
            border-color: rgba(var(--color-accent-rgb, 0,212,255), 0.6);
          }
        }

        /* Glowing featured dot */
        .pj2-featured-dot {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 10px var(--color-accent), 0 0 20px rgba(var(--color-accent-rgb, 0,212,255), 0.4);
          z-index: 2;
        }

        /* ── Thumbnail ──────────────────────────────────── */
        .pj2-thumb {
          height: 150px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(18,22,38,0.9), rgba(13,18,36,0.95));
          overflow: hidden;
          flex-shrink: 0;
        }
        .pj2-thumb-img-wrap {
          position: absolute;
          inset: 0;
        }
        .pj2-thumb-img {
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        @media (hover: hover) {
          .pj2-case-card:hover .pj2-thumb-img {
            transform: scale(1.04);
          }
        }
        .pj2-thumb-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          text-align: center;
        }
        .pj2-thumb-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          letter-spacing: -0.01em;
        }

        /* ── Card Body ──────────────────────────────────── */
        .pj2-case-body {
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          flex: 1;
        }
        .pj2-case-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }
        .pj2-case-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--color-accent);
        }
        .pj2-case-date {
          font-size: 11px;
          color: var(--color-text-muted);
        }
        .pj2-case-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-primary, #e8ecf6);
          line-height: 1.3;
          margin: 0;
        }
        .pj2-case-client {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin: 0;
        }
        .pj2-case-metric {
          font-size: 0.8rem;
          color: var(--color-success, #4ade80);
          font-weight: 600;
          padding-top: 8px;
          border-top: 1px solid var(--color-border, rgba(255,255,255,0.07));
          margin: 2px 0 0;
        }
        .pj2-case-tags {
          display: flex;
          flex-wrap: nowrap;
          gap: 6px;
          margin-top: 2px;
          overflow: hidden;
        }
        .pj2-case-tags span {
          font-size: 10.5px;
          color: var(--color-text-secondary);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border, rgba(255,255,255,0.07));
          padding: 3px 8px;
          border-radius: 5px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pj2-tags-overflow {
          font-size: 10.5px;
          color: var(--color-accent);
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.2) !important;
          padding: 3px 7px;
          border-radius: 5px;
          white-space: nowrap;
          flex-shrink: 0;
          font-weight: 700;
        }

        /* ══════════════════════════════════════════════
           QA-CARD GRID
        ══════════════════════════════════════════════ */
        .pj2-qa-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 2rem;
        }

        .pj2-qa-card {
          background: var(--color-card, #0d1224);
          border: 1px solid var(--color-border, rgba(255,255,255,0.08));
          border-radius: 10px;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        @media (hover: hover) {
          .pj2-qa-card:hover {
            border-color: rgba(155,140,249,0.4);
            transform: translateY(-2px);
          }
        }

        .pj2-qa-logo {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: rgba(155,140,249,0.12);
          border: 1px solid rgba(155,140,249,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9b8cf9;
          font-weight: 800;
          font-size: 14px;
          flex-shrink: 0;
        }
        .pj2-qa-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-primary, #e8ecf6);
          line-height: 1.3;
        }
        .pj2-qa-role {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        /* ══════════════════════════════════════════════
           METRIC NUMBER HIGHLIGHT
        ══════════════════════════════════════════════ */
        .pj2-metric-num { color: var(--color-success, #4ade80); font-weight: 900; }

        /* ══════════════════════════════════════════════
           MOBILE / TABLET EXTRAS (Hidden on Desktop)
        ══════════════════════════════════════════════ */
        .pj2-carousel-dots,
        .pj2-carousel-hint,
        .pj2-show-all-btn {
          display: none;
        }

        /* ══════════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .pj2-case-carousel-wrap { margin-bottom: 44px; }
          .pj2-case-grid {
            display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory;
            padding: 2px 2px 12px; margin: 0 -40px; padding-left: 40px; padding-right: 40px;
            -webkit-overflow-scrolling: touch; scrollbar-width: none;
          }
          .pj2-case-grid::-webkit-scrollbar { display: none; }
          .pj2-case-card {
            flex: 0 0 54%; max-width: 340px; scroll-snap-align: start;
          }

          .pj2-thumb { height: 72px; margin-bottom: 2px; border-radius: 8px; }

          .pj2-carousel-dots { display: flex; gap: 5px; justify-content: center; margin-top: 2px; }
          .pj2-carousel-dots span { width: 5px; height: 5px; border-radius: 50%; background: var(--color-border, rgba(255,255,255,0.08)); transition: background 0.2s, width 0.2s; }
          .pj2-carousel-dots span.active { background: var(--color-accent); width: 14px; border-radius: 3px; }
          .pj2-carousel-hint { display: block; text-align: center; font-size: 10.5px; color: var(--color-text-muted); margin-top: 8px; }

          .pj2-qa-grid { grid-template-columns: repeat(3, 1fr); max-height: 600px; overflow: hidden; transition: max-height 0.4s ease; }
          .pj2-qa-grid.expanded { max-height: 3000px; }
          .pj2-qa-card.hidden-row { display: none; }
          
          .pj2-show-all-btn {
            display: block; width: 100%; margin-top: 10px; padding: 11px; border-radius: 10px;
            background: rgba(155, 140, 249, 0.08); border: 1px solid rgba(155, 140, 249, 0.25);
            color: #9b8cf9; font-weight: 700; font-size: 12.5px; font-family: inherit;
            cursor: pointer; transition: background 0.2s; text-align: center;
          }
          .pj2-show-all-btn:hover { background: rgba(155, 140, 249, 0.15); }
        }

        @media (max-width: 768px) {
          .pj2-case-grid { gap: 12px; margin: 0 -16px; padding-left: 16px; padding-right: 16px; }
          .pj2-case-card { flex: 0 0 82%; max-width: 300px; }
          .pj2-qa-grid { grid-template-columns: repeat(2, 1fr); gap: 9px; }
          .pj2-sub-title { font-size: 1.15rem; }
          .pj2-section-gap { height: 2.5rem; }
        }

        /* ══════════════════════════════════════════════
           OVERLAY & DRAWER — very high z-index so nothing
           from other sections can stack above them
        ══════════════════════════════════════════════ */
        .pj2-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(10px);
          z-index: 9998; animation: pj2FadeIn 0.3s ease;
        }
        .pj2-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(560px, 100vw);
          background: #0a0f1a;
          z-index: 9999; box-shadow: -10px 0 50px rgba(0,0,0,0.5);
          overflow-y: auto; animation: pj2SlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* Suppress all sibling sections below the overlay when drawer is open */
        body.pj-drawer-open #projects {
          position: relative;
          z-index: 9999;
        }
        body.pj-drawer-open section:not(#projects) {
          position: relative;
          z-index: 1;
          pointer-events: none;
        }
        @keyframes pj2SlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pj2FadeIn  { from { opacity: 0; } to { opacity: 1; } }

        .pj2-close {
          position: absolute; top: 1.5rem; left: 1.5rem;
          width: 2.5rem; height: 2.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 1002; transition: background 0.2s, transform 0.2s;
        }
        .pj2-close:hover { background: rgba(255,255,255,0.2); transform: scale(1.08); }

        .pj2-drawer-hero { position: relative; height: 280px; flex-shrink: 0; }
        .pj2-drawer-img { object-fit: cover; }
        .pj2-drawer-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(123,95,253,0.1));
          display: flex; align-items: center; justify-content: center;
          font-size: 5rem; font-weight: 900; color: rgba(255,255,255,0.08);
        }

        .pj2-drawer-main { padding: 2.25rem; }
        .pj2-drawer-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1.75rem; }
        .pj2-drawer-tag { font-size: 0.7rem; font-weight: 800; color: var(--color-accent); text-transform: uppercase; margin-bottom: 0.6rem; display: block; letter-spacing: 0.08em; }
        .pj2-drawer-title { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1.1; margin: 0 0 0.4rem; }
        .pj2-drawer-company { font-size: 1rem; color: var(--color-text-secondary); margin: 0; }
        .pj2-drawer-period { font-size: 0.75rem; color: var(--color-text-muted); white-space: nowrap; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 0.4rem 0.9rem; border-radius: 10px; flex-shrink: 0; }

        .pj2-drawer-section { margin-bottom: 2rem; }
        .pj2-section-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem; display: block; }
        .pj2-drawer-desc { font-size: 0.95rem; line-height: 1.8; color: var(--color-text-secondary); }

        .pj2-achievements { list-style: none; padding: 0; display: grid; gap: 0.75rem; }
        .pj2-achievements li { background: rgba(255,255,255,0.02); padding: 1rem 1rem 1rem 2.75rem; border-radius: 12px; font-size: 0.9rem; color: var(--color-text-secondary); position: relative; line-height: 1.5; }
        .pj2-achievements li::before { content: '✓'; position: absolute; left: 1rem; color: #22D3A5; font-weight: 900; }

        .pj2-tech-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .pj2-tech-tag { padding: 0.35rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 50px; font-size: 0.78rem; color: var(--color-text-secondary); }

        .pj2-drawer-footer { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 2.5rem; }
        .pj2-action-btn { flex: 1; min-width: 130px; padding: 0.85rem; border-radius: 12px; font-weight: 700; text-align: center; text-decoration: none; font-size: 0.875rem; transition: all 0.25s; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.08); }
        .pj2-action-btn:hover { background: rgba(255,255,255,0.1); }
        .pj2-action-btn--primary { background: var(--color-accent); color: #000; border-color: transparent; font-weight: 800; }
        .pj2-action-btn--primary:hover { box-shadow: 0 0 20px rgba(var(--color-accent-rgb, 0,212,255), 0.4); }

        @media (max-width: 768px) {
          .pj2-drawer-hero { height: 200px; }
          .pj2-drawer-main { padding: 1.5rem; }
          .pj2-drawer-title { font-size: 1.65rem; }
        }
      `}</style>
    </section>
  );
}
