'use client';
import { useEffect, useRef } from 'react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const proficiencyMap: Record<string, number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 95,
};

const categoryColors: Record<string, string> = {
  Testing:     '#22D3A5',
  Automation:  '#00D4FF',
  Languages:   '#7B5FFD',
  Tools:       '#F59E0B',
  Frameworks:  '#EC4899',
  'CI/CD':    '#6366F1',
  Cloud:       '#0EA5E9',
  Databases:   '#14B8A6',
  Other:       '#94A3B8',
};

export default function SkillsSection({ grouped }: { grouped: Record<string, Skill[]> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.fade-in, .skill-bar-fill').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [grouped]);

  const categories = Object.keys(grouped || {});

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">Skills & Tech Stack</span>
          <h2 className="section-title fade-in delay-1">What I Work With</h2>
          <p className="section-desc fade-in delay-2">
            Tools, frameworks, and technologies I use to build quality software.
          </p>
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
                <div className="skill-list">
                  {grouped[cat].map((skill) => (
                    <div key={skill._id} className="skill-item">
                      <div className="skill-item-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-proficiency">{skill.proficiency}</span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{
                            '--fill-width': `${proficiencyMap[skill.proficiency]}%`,
                            '--fill-color': categoryColors[cat] || '#00D4FF',
                          } as React.CSSProperties}
                        />
                      </div>
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
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .skill-category-card {
          padding: 1.5rem;
        }
        .skill-cat-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }
        .skill-cat-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .skill-cat-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-primary);
          flex: 1;
        }
        .skill-cat-count {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 0.15rem 0.5rem;
        }
        .skill-list { display: flex; flex-direction: column; gap: 0.875rem; }
        .skill-item {}
        .skill-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
        }
        .skill-name { font-size: 0.875rem; color: var(--color-text-primary); font-weight: 500; }
        .skill-proficiency { font-size: 0.7rem; color: var(--color-text-muted); font-weight: 500; }
        .skill-bar-track {
          height: 5px;
          background: rgba(255,255,255,0.06);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          width: 0;
          border-radius: var(--radius-full);
          background: linear-gradient(90deg, var(--fill-color), color-mix(in srgb, var(--fill-color) 60%, #fff));
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .skill-bar-fill.visible {
          width: var(--fill-width);
        }
      `}</style>
    </section>
  );
}
