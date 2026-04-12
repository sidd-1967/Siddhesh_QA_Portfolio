'use client';
import { useEffect, useRef } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

export default function ProjectsSection({ projects, config }: { projects: Project[], config?: any }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.fade-in, .project-card').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects]);

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || "Work"}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || "Projects"}</h2>
        </div>

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No projects added yet.</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project, i) => (
              <article
                key={project._id}
                className={`project-card card fade-in delay-${Math.min(i % 3 + 1, 5)}${project.featured ? ' project-featured' : ''}`}
              >
                {project.featured && <div className="project-featured-badge">Featured</div>}

                {project.imageUrl && (
                  <div className="project-image">
                    <img src={project.imageUrl} alt={project.title} />
                  </div>
                )}

                <div className="project-body">
                  <div className="project-folder-icon" aria-hidden="true">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth="1.5">
                      <path d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828a2 2 0 001.414.586H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                    </svg>
                  </div>

                  <h3 className="project-title">{project.title}</h3>
                  <div
                    className="project-desc ql-editor"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />

                  {project.techStack?.length > 0 && (
                    <div className="project-tags">
                      {project.techStack.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="project-links">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="GitHub">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="Live Demo">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .project-card {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .project-featured {
          border-color: rgba(0,212,255,0.3);
          box-shadow: 0 0 30px rgba(0,212,255,0.08);
        }
        .project-featured-badge {
          position: absolute;
          top: 1rem; right: 1rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-accent);
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.3);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }
        .project-image {
          height: 180px;
          overflow: hidden;
        }
        .project-image img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .project-card:hover .project-image img {
          transform: scale(1.05);
        }
        .project-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .project-folder-icon { margin-bottom: 1rem; }
        .project-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--color-text-primary);
        }
        .project-desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          flex: 1;
          margin-bottom: 1rem;
          padding: 0;
          border: none;
          background: none;
          overflow-wrap: break-word;
        }
        .project-desc ul, .project-desc ol { padding-left: 1.25rem; margin-bottom: 0.25rem; }
        .project-desc li { margin-bottom: 0.2rem; }
        .project-desc p { margin-bottom: 0.3rem; }
        .project-desc strong { color: var(--color-text-primary); }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .project-links {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }
        .project-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .project-link:hover { color: var(--color-accent); }
      `}</style>
    </section>
  );
}
