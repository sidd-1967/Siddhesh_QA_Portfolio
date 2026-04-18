'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface Skill {
  _id: string;
  name: string;
  category: string;
  iconUrl?: string;
}

const categoryColors: Record<string, string> = {
  Testing: '#22D3A5',
  Automation: '#00D4FF',
  Languages: '#7B5FFD',
  Tools: '#F59E0B',
  Frameworks: '#EC4899',
  'CI/CD': '#6366F1',
  Cloud: '#0EA5E9',
  Databases: '#14B8A6',
  Other: '#94A3B8',
};

export default function SkillsSection({ grouped, config, categories: orderedCategories }: { grouped: Record<string, Skill[]>, config?: any, categories?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.fade-in, .skill-pill').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [grouped]);

  const categories = (orderedCategories || Object.keys(grouped || {})).filter(cat => grouped[cat] && grouped[cat].length > 0);

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || "Skills & Tech Stack"}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || "What I Work With"}</h2>
        </div>

        {categories.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No skills added yet.</p>
        ) : (
          <div className="skills-grid fade-in delay-2">
            {categories.map((cat) => (
              <div key={cat} className="skill-category-card card">
                <div className="skill-cat-header">
                  <span
                    className="skill-cat-dot"
                    style={{ background: categoryColors[cat] || '#94A3B8' }}
                  />
                  <h3 className="skill-cat-title">{cat}</h3>
                  <span className="skill-cat-count">{grouped[cat].length}</span>
                </div>
                <div className="skill-pill-container">
                  {grouped[cat].map((skill, i) => (
                    <div
                      key={skill._id}
                      className="skill-pill"
                      style={{ transitionDelay: `${i * 0.05}s` }}
                    >
                      {skill.iconUrl && <Image src={skill.iconUrl} alt="" className="skill-pill-icon" width={24} height={24} />}
                      <span className="skill-pill-name">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .skill-category-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }
        .skill-cat-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.75rem;
        }
        .skill-cat-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 10px currentColor;
        }
        .skill-cat-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          flex: 1;
          letter-spacing: 0.02em;
        }
        .skill-cat-count {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-text-muted);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.15rem 0.45rem;
        }
        .skill-pill-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .skill-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: all var(--transition-normal);
          opacity: 0;
          transform: translateY(10px);
        }
        .skill-pill.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .skill-pill:hover {
          background: rgba(0, 212, 255, 0.08);
          border-color: rgba(0, 212, 255, 0.3);
          color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .skill-pill-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        @media (max-width: 640px) {
          .skills-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
