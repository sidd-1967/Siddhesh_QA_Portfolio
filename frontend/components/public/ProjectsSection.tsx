'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
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
  return text.replace(
    /(\d+[\d,]*%?|\d+\/\d+|↑\d+|↓\d+|zero|100%|0\s+P\d+)/gi,
    '<strong class="metric-num">$1</strong>'
  );
}

function ProjectIcon({ domain, title }: { domain?: string; title: string }) {
  const d = (domain || title).toLowerCase();

  if (d.includes('api') || d.includes('rest') || d.includes('postman')) {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="rgba(0,212,255,0.12)" />
        <path d="M16 28h20M28 18l10 10-10 10" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="28" r="3" fill="#00D4FF"/>
      </svg>
    );
  }
  if (d.includes('selenium') || d.includes('automation') || d.includes('e2e') || d.includes('cypress') || d.includes('playwright')) {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="rgba(123,95,253,0.12)" />
        <rect x="16" y="18" width="20" height="16" rx="3" stroke="#7B5FFD" strokeWidth="2.5"/>
        <path d="M20 26l3 3 6-6" stroke="#7B5FFD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (d.includes('performance') || d.includes('load') || d.includes('jmeter') || d.includes('k6')) {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="26" fill="rgba(34,211,165,0.12)" />
        <path d="M16 38l6-10 5 5 5-12 5 7" stroke="#22D3A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (d.includes('mobile') || d.includes('appium') || d.includes('android') || d.includes('ios')) {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="rgba(255,184,0,0.12)" />
        <rect x="20" y="14" width="12" height="24" rx="3" stroke="#FFB800" strokeWidth="2.5"/>
        <circle cx="26" cy="34" r="1.5" fill="#FFB800"/>
      </svg>
    );
  }
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill="rgba(0,212,255,0.10)" />
      <path d="M18 20h18M18 27h11M18 34h14" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="36" cy="34" r="4" stroke="#7B5FFD" strokeWidth="2"/>
      <path d="M34.2 34l1.5 1.5 2.3-2.3" stroke="#7B5FFD" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProjectsSection({ projects, config }: { projects: Project[]; config?: { title?: string; subtitle?: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  }, [projects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sortedProjects]);

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : '';
  }, [activeProject]);

  const handleScroll = () => {
    if (gridRef.current) {
      const index = Math.round(gridRef.current.scrollLeft / gridRef.current.offsetWidth);
      setActiveIndex(index);
    }
  };

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || 'Portfolio'}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || 'Real-World Work'}</h2>
        </div>

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No projects added yet.</p>
        ) : (
          <div className="pj-wrapper">
            <div className="pj-grid" ref={gridRef} onScroll={handleScroll}>
              {sortedProjects.map((project, i) => (
                <article
                  key={project._id}
                  className={`pj-card fade-in delay-${(i % 3) + 1}`}
                >

                  {/* ══ DESKTOP: Uiverse-faithful hover-reveal ══
                      .pj-front  = like .card   (z-index:2, always on top)
                      .pj-back   = like .card2  (z-index:1, same height initially, expands via + sibling)
                      .pj-reveal = like .lower  (slides from behind .pj-front into expanded area)
                      .pj-bar    = like .card3  (status bar at bottom of expanded panel)
                  */}
                  <div className="pj-desktop">
                    <div className="pj-uw-cardm">
                      {/* MIDDLE LOGO CARD — always visible, remains centered */}
                      <div className="pj-uw-card">
                        {project.imageUrl ? (
                          <div className="pj-uw-logo-wrapper">
                            <Image
                              src={project.imageUrl}
                              alt={`${project.title} logo`}
                              fill
                              className="pj-uw-logo-img"
                              sizes="250px"
                            />
                          </div>
                        ) : (
                          <div className="pj-uw-logo-fallback">
                            <ProjectIcon domain={project.domain} title={project.title} />
                            <span className="pj-uw-fallback-text">{project.company || project.title}</span>
                          </div>
                        )}
                        {project.featured && <span className="pj-uw-badge">Featured</span>}
                      </div>

                      <div className="pj-uw-card2">
                        <div className="pj-uw-upper">
                          <span className="pj-uw-title">{project.title}</span>
                          <span className="pj-uw-domain">{project.domain || 'QA Portfolio'}</span>
                        </div>
                        <div className="pj-uw-lower">
                          <span className="pj-uw-company">{project.company || 'QA Engineer'}</span>
                          <button
                            className="pj-uw-details-btn"
                            onClick={() => setActiveProject(project)}
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ══ MOBILE / TABLET: Tap-to-open image card ══ */}
                  <button
                    className="pj-compact"
                    onClick={() => setActiveProject(project)}
                    aria-label={`View details for ${project.title}`}
                  >
                    {/* Widescreen image card (matches desktop aspect-ratio & style) */}
                    <div className="pj-m-img-card">
                      {project.imageUrl ? (
                        <div className="pj-m-img-wrapper">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="pj-m-img"
                            sizes="(max-width: 768px) 85vw, 50vw"
                          />
                        </div>
                      ) : (
                        <div className="pj-m-fallback">
                          <ProjectIcon domain={project.domain} title={project.title} />
                          <span className="pj-m-fallback-name">{project.company || project.title}</span>
                        </div>
                      )}
                      {/* Corner ribbon for featured */}
                      {project.featured && <span className="pj-m-ribbon">Featured</span>}
                    </div>

                    {/* Text Details Area below the image */}
                    <div className="pj-m-details">
                      <div className="pj-m-details-left">
                        <span className="pj-m-domain">{project.domain?.toUpperCase() || 'QA PROJECT'}</span>
                        <span className="pj-m-title">{project.title}</span>
                        {project.company && <span className="pj-m-company">{project.company}</span>}
                      </div>
                      <div className="pj-m-tap-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </button>

                </article>
              ))}
            </div>

            <div className="pj-carousel-ui">
              <div className="pj-dots">
                {sortedProjects.map((_, i) => (
                  <div key={i} className={`pj-dot ${activeIndex === i ? 'active' : ''}`} />
                ))}
              </div>
              <span className="pj-swipe-hint">swipe to see more</span>
            </div>
          </div>
        )}
      </div>

      {activeProject && (
        <>
          <div className="pj-overlay" onClick={() => setActiveProject(null)} />
          <aside className="pj-drawer">
            <button className="pj-close" onClick={() => setActiveProject(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="pj-drawer-body">
              <div className="pj-drawer-hero">
                {activeProject.imageUrl ? (
                  <Image src={activeProject.imageUrl} alt={activeProject.title} fill className="pj-drawer-img" />
                ) : (
                  <div className="pj-drawer-placeholder">
                    <span>{activeProject.company?.charAt(0) || activeProject.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="pj-drawer-main">
                <div className="pj-drawer-header">
                  <div>
                    <span className="pj-drawer-tag">{activeProject.domain || 'QA Project'}</span>
                    <h2 className="pj-drawer-title">{activeProject.title}</h2>
                    {activeProject.company && <p className="pj-drawer-company">{activeProject.company}</p>}
                  </div>
                  {activeProject.period && <span className="pj-drawer-period">{activeProject.period}</span>}
                </div>
                <div className="pj-drawer-section">
                  <h4 className="pj-section-label">The Project</h4>
                  <div className="pj-drawer-desc ql-editor" dangerouslySetInnerHTML={{ __html: activeProject.description }} />
                </div>
                {activeProject.achievements && activeProject.achievements.length > 0 && (
                  <div className="pj-drawer-section">
                    <h4 className="pj-section-label">Key Outcomes</h4>
                    <ul className="pj-achievements">
                      {activeProject.achievements.map((ach, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: highlightMetric(ach) }} />
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pj-drawer-section">
                  <h4 className="pj-section-label">Technology Used</h4>
                  <div className="pj-tech-list">
                    {activeProject.techStack.map(t => <span key={t} className="pj-tech-tag">{t}</span>)}
                  </div>
                </div>
                <div className="pj-drawer-footer">
                  {activeProject.testReportUrl && (
                    <a href={activeProject.testReportUrl} target="_blank" rel="noopener noreferrer" className="pj-action-btn pj-action-btn--primary">Test Report ↗</a>
                  )}
                  {activeProject.githubUrl && (
                    <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="pj-action-btn">GitHub</a>
                  )}
                  {activeProject.liveUrl && (
                    <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="pj-action-btn">Live Site</a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      <style>{`
        .pj-wrapper { margin-top: 2rem; position: relative; }

        .pj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
          overflow: visible;
        }

        .pj-card { position: relative; z-index: 1; height: 170px; }
        .pj-card:hover { z-index: 20; }

        .pj-desktop { position: relative; height: 100%; }
        .pj-compact { display: none; }

        .pj-uw-cardm {
          position: relative;
          width: 290px;
          height: 150px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pj-uw-card {
          position: absolute;
          width: 290px;
          height: 150px;
          border-radius: 25px;
          background: rgba(18, 22, 38, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          cursor: pointer;
          transition: all 0.4s ease-in-out;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .pj-uw-cardm:hover .pj-uw-card {
          border-color: rgba(0, 212, 255, 0.25);
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
          cursor: pointer;
        }

        .pj-uw-logo-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .pj-uw-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .pj-uw-cardm:hover .pj-uw-logo-img {
          transform: scale(1.05);
        }

        .pj-uw-logo-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem;
          text-align: center;
          transition: color 0.4s;
        }
        .pj-uw-fallback-text {
          font-size: 0.95rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: -0.01em;
          transition: color 0.4s;
        }

        .pj-uw-badge {
          position: absolute;
          top: 16px;
          right: -34px;
          width: 120px;
          background: linear-gradient(135deg, #00D4FF, #7B5FFD);
          color: #fff;
          padding: 0.25rem 0;
          font-size: 0.58rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          z-index: 3;
        }

        .pj-uw-card2 {
          position: absolute;
          width: 280px;
          height: 150px;
          border-radius: 35px;
          background: #101422;
          border: 1px solid rgba(255, 255, 255, 0.06);
          z-index: 1;
          transition: all 0.4s ease-in-out;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .pj-uw-cardm:hover .pj-uw-card2 {
          height: 320px;
        }

        .pj-uw-upper {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 85px;
          padding: 1rem 1.2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.25rem;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
          text-align: center;
        }

        .pj-uw-cardm:hover .pj-uw-card2 .pj-uw-upper {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.1s;
        }

        .pj-uw-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.01em;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .pj-uw-domain {
          font-size: 0.65rem;
          font-weight: 700;
          color: #00D4FF;
          background: rgba(0, 212, 255, 0.1);
          padding: 0.15rem 0.55rem;
          border-radius: 6px;
          width: fit-content;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .pj-uw-lower {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 85px;
          padding: 0 1.4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        }

        .pj-uw-cardm:hover .pj-uw-card2 .pj-uw-lower {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.1s;
        }

        .pj-uw-company {
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 68%;
        }

        .pj-uw-details-btn {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.28);
          color: #00D4FF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.35rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, box-shadow 0.25s;
        }

        .pj-uw-details-btn:hover {
          background: #00D4FF;
          color: #000;
          box-shadow: 0 0 16px rgba(0, 212, 255, 0.4);
        }

        /* ── STATUS BAR (.pj-uw-card3) ──────────────────────────────── */
        .pj-uw-card3 {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #22C55E;
          font-size: 0.65rem;
          font-weight: 800;
          color: #000;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-bottom-left-radius: 35px;
          border-bottom-right-radius: 35px;
        }

        .pj-uw-card3--featured {
          background: linear-gradient(90deg, #00D4FF, #7B5FFD);
          color: #fff;
        }

        /* ── COMPACT CARD (Tablet / Mobile) — tap-to-open image card ── */
        .pj-compact {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          text-align: left;
          width: 100%;
          transition: transform 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .pj-compact:active {
          transform: scale(0.98);
        }

        .pj-m-img-card {
          position: relative;
          width: 100%;
          aspect-ratio: 290 / 150; /* Perfect widescreen ratio exactly matching desktop! */
          border-radius: 24px;
          overflow: hidden;
          background: rgba(18, 22, 38, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .pj-compact:hover .pj-m-img-card {
          border-color: rgba(0, 212, 255, 0.25);
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
        }

        .pj-m-img-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .pj-m-img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pj-compact:hover .pj-m-img {
          transform: scale(1.03);
        }

        /* Fallback when no image */
        .pj-m-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: radial-gradient(circle at 60% 40%, rgba(0,212,255,0.08), rgba(123,95,253,0.08) 60%, transparent);
        }
        .pj-m-fallback-name {
          font-size: 1rem;
          font-weight: 800;
          color: rgba(255,255,255,0.85);
          letter-spacing: -0.01em;
        }

        /* Corner ribbon — mirrors desktop */
        .pj-m-ribbon {
          position: absolute;
          top: 14px;
          right: -30px;
          width: 110px;
          background: linear-gradient(135deg, #00D4FF, #7B5FFD);
          color: #fff;
          padding: 0.22rem 0;
          font-size: 0.55rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          z-index: 3;
        }

        .pj-m-details {
          width: 100%;
          padding: 0.75rem 0.5rem 0.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .pj-m-details-left {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .pj-m-domain {
          display: inline-block;
          font-size: 0.62rem;
          font-weight: 800;
          color: #00D4FF;
          letter-spacing: 0.06em;
          background: rgba(0,212,255,0.12);
          padding: 0.12rem 0.5rem;
          border-radius: 5px;
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 0.1rem;
        }
        .pj-m-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pj-m-company {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pj-m-tap-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00D4FF;
          transition: background 0.2s, transform 0.2s;
        }
        .pj-compact:active .pj-m-tap-icon {
          background: rgba(0,212,255,0.25);
          transform: scale(0.9);
        }

        /* Carousel dots */
        .pj-carousel-ui { display: none; }

        /* ── Responsive ──────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .pj-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
          .pj-card { height: auto; }
          .pj-desktop { display: none; }
          .pj-compact { display: flex; flex-direction: column; gap: 0.75rem; }
        }

        @media (max-width: 768px) {
          .pj-grid {
            display: flex; flex-wrap: nowrap;
            overflow-x: auto; scroll-snap-type: x mandatory;
            gap: 1rem; padding: 0 1.5rem 1rem; margin: 0 -1.5rem;
            scrollbar-width: none;
          }
          .pj-grid::-webkit-scrollbar { display: none; }
          .pj-card { flex: 0 0 80%; scroll-snap-align: center; height: auto; }
          .pj-carousel-ui { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; margin-top: 1.5rem; }
          .pj-dots { display: flex; gap: 0.5rem; }
          .pj-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: all 0.3s; }
          .pj-dot.active { width: 24px; border-radius: 4px; background: var(--color-accent); }
          .pj-swipe-hint { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 500; }
        }

        /* ── Drawer ──────────────────────────────────────────────────── */
        .pj-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
          z-index: 1000; animation: pjFadeIn 0.3s ease;
        }
        .pj-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(560px, 100vw); background: #0a0f1a;
          z-index: 1001; box-shadow: -10px 0 50px rgba(0,0,0,0.5);
          overflow-y: auto; animation: pjSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pjSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pjFadeIn  { from { opacity: 0; } to { opacity: 1; } }

        .pj-close {
          position: absolute; top: 1.5rem; left: 1.5rem;
          width: 2.5rem; height: 2.5rem; background: #fff; color: #000;
          border: none; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 1002; transition: transform 0.2s;
        }
        .pj-close:hover { transform: scale(1.1); }

        .pj-drawer-hero { position: relative; height: 300px; }
        .pj-drawer-img { object-fit: cover; }
        .pj-drawer-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(123,95,253,0.12));
          display: flex; align-items: center; justify-content: center;
          font-size: 6rem; font-weight: 900; color: rgba(255,255,255,0.1);
        }
        .pj-drawer-main { padding: 2.5rem; }
        .pj-drawer-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 2rem; }
        .pj-drawer-tag { font-size: 0.75rem; font-weight: 800; color: var(--color-accent); text-transform: uppercase; margin-bottom: 0.75rem; display: block; letter-spacing: 0.08em; }
        .pj-drawer-title { font-size: 2.25rem; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 0.5rem; }
        .pj-drawer-company { font-size: 1.05rem; color: var(--color-text-secondary); }
        .pj-drawer-period { font-size: 0.78rem; color: var(--color-text-muted); white-space: nowrap; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 0.4rem 0.9rem; border-radius: 10px; flex-shrink: 0; }

        .pj-drawer-section { margin-bottom: 2.5rem; }
        .pj-section-label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; display: block; }
        .pj-drawer-desc { font-size: 1rem; line-height: 1.8; color: var(--color-text-secondary); }

        .pj-achievements { list-style: none; padding: 0; display: grid; gap: 1rem; }
        .pj-achievements li { background: rgba(255,255,255,0.02); padding: 1.25rem 1.25rem 1.25rem 3rem; border-radius: 16px; font-size: 0.95rem; color: var(--color-text-secondary); position: relative; }
        .pj-achievements li::before { content: '✓'; position: absolute; left: 1.25rem; color: #22D3A5; font-weight: 900; }

        .pj-tech-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .pj-tech-tag { padding: 0.4rem 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 50px; font-size: 0.8rem; color: var(--color-text-secondary); }

        .pj-drawer-footer { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 3rem; }
        .pj-action-btn { flex: 1; min-width: 140px; padding: 1rem; border-radius: 14px; font-weight: 700; text-align: center; text-decoration: none; transition: all 0.3s; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.08); }
        .pj-action-btn:hover { background: rgba(255,255,255,0.1); }
        .pj-action-btn--primary { background: var(--color-accent); color: #000; border-color: transparent; }
        .pj-action-btn--primary:hover { box-shadow: 0 0 20px rgba(0,212,255,0.4); }

        .metric-num { color: #22D3A5; font-weight: 900; }

        @media (max-width: 768px) {
          .pj-drawer-hero { height: 200px; }
          .pj-drawer-main { padding: 1.5rem; }
          .pj-drawer-title { font-size: 1.75rem; }
        }
      `}</style>
    </section>
  );
}
