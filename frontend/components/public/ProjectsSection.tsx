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

export default function ProjectsSection({ projects, config }: { projects: Project[]; config?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  }, [projects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sortedProjects]);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeProject]);

  const handleScroll = () => {
    if (gridRef.current) {
      const scrollLeft = gridRef.current.scrollLeft;
      const width = gridRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
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
            <div 
              className="pj-grid" 
              ref={gridRef}
              onScroll={handleScroll}
            >
              {sortedProjects.map((project, i) => (
                <article
                  key={project._id}
                  className={`pj-card fade-in delay-${(i % 3) + 1} ${project.featured ? 'pj-card--featured' : ''}`}
                >
                  {/* Desktop/Tablet View (Image Focused) */}
                  <div className="pj-card-inner pj-desktop-card">
                    <div className="pj-image-box">
                      {project.imageUrl ? (
                        <Image src={project.imageUrl} alt={project.title} fill sizes="33vw" className="pj-img" />
                      ) : (
                        <div className="pj-placeholder"><span>{project.company?.charAt(0) || project.title.charAt(0)}</span></div>
                      )}
                      {project.featured && <span className="pj-featured-badge">Featured</span>}
                    </div>
                    <div className="pj-content">
                      <div className="pj-meta">
                        {project.domain && <span className="pj-domain">{project.domain}</span>}
                        <h3 className="pj-title">{project.title}</h3>
                        {project.company && <p className="pj-company">{project.company}</p>}
                      </div>
                      <div className="pj-footer">
                        <div className="pj-tech-mini">
                          {project.techStack.slice(0, 3).map(t => <span key={t} className="pj-tech-dot" />)}
                        </div>
                        <button className="pj-link-btn" onClick={() => setActiveProject(project)}>Details ↗</button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Compact View (Dashboard Style) */}
                  <div className="pj-card-inner pj-compact-card">
                    <div className="pj-m-header">
                      <div className="pj-m-header-left">
                        <span className="pj-m-domain">{project.domain?.toUpperCase() || 'QA PROJECT'}</span>
                        <span className="pj-m-period">{project.period || '2024'}</span>
                      </div>
                      {project.featured && <span className="pj-m-featured">Featured</span>}
                    </div>
                    <div className="pj-m-body">
                      <h3 className="pj-m-title">{project.title}</h3>
                      {project.topMetric && (
                        <div className="pj-m-metric"><span className="pj-m-dot" /> {project.topMetric}</div>
                      )}
                      <div className="pj-m-footer">
                        <div className="pj-m-tech">
                          {project.techStack.slice(0, 1).map(t => <span key={t} className="pj-m-tag">{t}</span>)}
                          {project.techStack.length > 1 && <span className="pj-m-tag">+{project.techStack.length - 1}</span>}
                        </div>
                        <button className="pj-m-details" onClick={() => setActiveProject(project)}>Details →</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Carousel Indicators (Mobile Only) */}
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

      {/* Side Drawer */}
      {activeProject && (
        <>
          <div className="pj-overlay" onClick={() => setActiveProject(null)} />
          <aside className="pj-drawer">
            <button className="pj-close" onClick={() => setActiveProject(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="pj-drawer-body">
              <div className="pj-drawer-hero">
                {activeProject.imageUrl ? (
                  <Image src={activeProject.imageUrl} alt={activeProject.title} fill className="pj-drawer-img" />
                ) : (
                  <div className="pj-drawer-placeholder"><span>{activeProject.company?.charAt(0) || activeProject.title.charAt(0)}</span></div>
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
                <div className="pj-drawer-section"><h4 className="pj-section-label">The Project</h4><div className="pj-drawer-desc ql-editor" dangerouslySetInnerHTML={{ __html: activeProject.description }} /></div>
                {activeProject.achievements && activeProject.achievements.length > 0 && (
                  <div className="pj-drawer-section"><h4 className="pj-section-label">Key Outcomes</h4><ul className="pj-achievements">{activeProject.achievements.map((ach, i) => <li key={i} dangerouslySetInnerHTML={{ __html: highlightMetric(ach) }} />)}</ul></div>
                )}
                <div className="pj-drawer-section"><h4 className="pj-section-label">Technology Used</h4><div className="pj-tech-list">{activeProject.techStack.map(t => <span key={t} className="pj-tech-tag">{t}</span>)}</div></div>
                <div className="pj-drawer-footer">
                  {activeProject.testReportUrl && <a href={activeProject.testReportUrl} target="_blank" rel="noopener noreferrer" className="pj-action-btn pj-action-btn--primary">Test Report ↗</a>}
                  {activeProject.githubUrl && <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="pj-action-btn">GitHub</a>}
                  {activeProject.liveUrl && <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="pj-action-btn">Live Site</a>}
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      <style>{`
        .pj-wrapper { margin-top: 2rem; position: relative; }
        .pj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .pj-card { position: relative; perspective: 1000px; }
        .pj-card-inner { 
          background: rgba(20, 25, 40, 0.4); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          border-radius: 24px; 
          overflow: hidden; 
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
          height: 100%; 
          display: flex; 
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative;
          z-index: 1;
        }
        
        .pj-card:hover .pj-card-inner {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 212, 255, 0.1);
        }

        /* Ambient Glow Behind Card */
        .pj-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--color-accent), #7B5FFD);
          border-radius: 24px;
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.5s;
          z-index: 0;
        }
        .pj-card:hover::before { opacity: 0.15; }

        .pj-card--featured .pj-card-inner { 
          border-color: rgba(0, 212, 255, 0.25); 
          background: linear-gradient(145deg, rgba(20, 25, 40, 0.6), rgba(0, 212, 255, 0.03));
        }

        .pj-desktop-card { display: flex; }
        .pj-compact-card { display: none; }
        
        .pj-image-box { position: relative; height: 190px; background: #0f121b; overflow: hidden; }
        .pj-image-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(20,25,40, 0.95));
          z-index: 1;
        }
        .pj-img { object-fit: cover; transition: transform 0.7s; }
        .pj-card:hover .pj-img { transform: scale(1.08); }
        
        .pj-featured-badge {
           position: absolute; top: 1rem; right: 1rem; z-index: 2;
           background: linear-gradient(90deg, #00D4FF, #7B5FFD);
           color: #fff; padding: 0.35rem 0.85rem; border-radius: 12px;
           font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
           box-shadow: 0 4px 15px rgba(0,212,255,0.4);
        }

        .pj-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; position: relative; z-index: 2; }
        .pj-domain { display: inline-block; font-size: 0.65rem; font-weight: 800; color: var(--color-accent); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.08em; background: rgba(0,212,255,0.1); padding: 0.2rem 0.6rem; border-radius: 8px;}
        .pj-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.3rem; letter-spacing: -0.02em; }
        .pj-company { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.2rem; }
        
        .pj-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .pj-tech-mini { display: flex; gap: 0.4rem; }
        .pj-tech-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); opacity: 0.7; box-shadow: 0 0 8px var(--color-accent); }
        .pj-tech-dot:nth-child(2) { background: #7B5FFD; box-shadow: 0 0 8px #7B5FFD;}
        .pj-tech-dot:nth-child(3) { background: #22D3A5; box-shadow: 0 0 8px #22D3A5;}
        
        .pj-link-btn { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          padding: 0.4rem 1rem; border-radius: 12px;
          font-size: 0.75rem; font-weight: 700; color: #fff; 
          cursor: pointer; transition: all 0.3s; 
          display: flex; align-items: center; gap: 0.3rem;
        }
        .pj-card:hover .pj-link-btn { background: var(--color-accent); color: #000; border-color: var(--color-accent); box-shadow: 0 0 15px rgba(0,212,255,0.4); }

        /* --- Compact Layout (Tablets & Mobile) --- */
        .pj-compact-card { padding: 1.75rem; text-align: left; background: radial-gradient(circle at top right, rgba(0,212,255,0.05), transparent 60%); }
        .pj-m-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
        .pj-m-header-left { display: flex; flex-direction: column; gap: 0.3rem; }
        .pj-m-domain { display: inline-block; font-size: 0.7rem; font-weight: 800; color: var(--color-accent); letter-spacing: 0.05em; background: rgba(0,212,255,0.1); padding: 0.2rem 0.6rem; border-radius: 6px; width: fit-content; }
        .pj-m-period { font-size: 0.75rem; color: var(--color-text-muted); padding-left: 0.2rem; }
        .pj-m-featured { background: linear-gradient(90deg, #00D4FF, #7B5FFD); color: #fff; padding: 0.3rem 0.8rem; border-radius: 12px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; box-shadow: 0 4px 10px rgba(0,212,255,0.3); }
        
        .pj-m-title { font-size: 1.35rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
        .pj-m-metric { font-size: 0.95rem; color: #22D3A5; font-weight: 600; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; background: rgba(34,211,165,0.08); padding: 0.4rem 0.8rem; border-radius: 8px; border: 1px solid rgba(34,211,165,0.2); }
        .pj-m-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; }
        
        .pj-m-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.25rem; }
        .pj-m-tech { display: flex; gap: 0.5rem; }
        .pj-m-tag { padding: 0.35rem 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary); }
        .pj-m-details { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; font-weight: 700; color: #fff; cursor: pointer; padding: 0.5rem 1rem; border-radius: 10px; transition: all 0.3s; }
        .pj-card:hover .pj-m-details { background: var(--color-accent); color: #000; border-color: var(--color-accent); box-shadow: 0 0 15px rgba(0,212,255,0.4); }

        .pj-carousel-ui { display: none; }

        @media (max-width: 1024px) {
          .pj-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .pj-desktop-card { display: none; }
          .pj-compact-card { display: block; }
        }

        @media (max-width: 768px) {
          .pj-grid { display: flex; flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1rem; padding: 0 1.5rem 1rem; margin: 0 -1.5rem; scrollbar-width: none; }
          .pj-grid::-webkit-scrollbar { display: none; }
          .pj-card { flex: 0 0 85%; scroll-snap-align: center; }
          .pj-carousel-ui { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; margin-top: 1.5rem; }
          .pj-dots { display: flex; gap: 0.5rem; }
          .pj-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: all 0.3s; }
          .pj-dot.active { width: 24px; border-radius: 4px; background: var(--color-accent); }
          .pj-swipe-hint { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 500; }
        }

        /* --- Drawer Overlay & Sidebar --- */
        .pj-overlay {
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);
          z-index: 1000; animation: fadeIn 0.3s ease;
        }

        .pj-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(560px, 100vw); background: #0a0f1a;
          z-index: 1001; box-shadow: -10px 0 50px rgba(0, 0, 0, 0.5);
          overflow-y: auto; animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .pj-close {
          position: absolute; top: 1.5rem; left: 1.5rem;
          width: 2.5rem; height: 2.5rem; background: #fff; color: #000;
          border: none; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 1002; transition: all 0.3s;
        }

        .pj-drawer-hero { position: relative; height: 300px; }
        .pj-drawer-img { object-fit: cover; }
        .pj-drawer-main { padding: 2.5rem; }
        .pj-drawer-tag { font-size: 0.75rem; font-weight: 800; color: var(--color-accent); text-transform: uppercase; margin-bottom: 0.75rem; display: block; }
        .pj-drawer-title { font-size: 2.25rem; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 0.5rem; }
        .pj-drawer-company { font-size: 1.1rem; color: var(--color-text-secondary); margin-bottom: 2rem; }

        .pj-drawer-section { margin-bottom: 3rem; }
        .pj-section-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
        .pj-drawer-desc { font-size: 1rem; line-height: 1.8; color: var(--color-text-secondary); }

        .pj-achievements { list-style: none; padding: 0; display: grid; gap: 1rem; }
        .pj-achievements li { background: rgba(255, 255, 255, 0.02); padding: 1.25rem 1.25rem 1.25rem 3rem; border-radius: 16px; font-size: 0.95rem; color: var(--color-text-secondary); position: relative; }
        .pj-achievements li::before { content: '✓'; position: absolute; left: 1.25rem; color: var(--color-success); font-weight: 900; }

        .pj-tech-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .pj-tech-tag { padding: 0.4rem 1rem; background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-full); font-size: 0.8rem; color: var(--color-text-secondary); }

        .pj-drawer-footer { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 4rem; }
        .pj-action-btn { flex: 1; min-width: 140px; padding: 1rem; border-radius: 14px; font-weight: 700; text-align: center; text-decoration: none; transition: all 0.3s; background: rgba(255, 255, 255, 0.05); color: #fff; }
        .pj-action-btn--primary { background: var(--color-accent); color: var(--color-bg); }

        @media (max-width: 768px) {
          .pj-drawer-hero { height: 200px; }
          .pj-drawer-main { padding: 1.5rem; }
          .pj-drawer-title { font-size: 1.75rem; }
        }
      `}</style>
    </section>
  );
}
