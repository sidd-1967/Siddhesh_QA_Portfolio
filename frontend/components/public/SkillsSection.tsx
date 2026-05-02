'use client';
import { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';

interface Skill {
  _id: string;
  name: string;
  category: string;
  iconUrl?: string;
}

const categoryMeta: Record<string, { color: string; glow: string }> = {
  Testing:     { color: '#22D3A5', glow: 'rgba(34,211,165,0.35)' },
  Automation:  { color: '#00D4FF', glow: 'rgba(0,212,255,0.35)' },
  Languages:   { color: '#7B5FFD', glow: 'rgba(123,95,253,0.35)' },
  Tools:       { color: '#F59E0B', glow: 'rgba(245,158,11,0.35)' },
  Frameworks:  { color: '#EC4899', glow: 'rgba(236,72,153,0.35)' },
  'CI/CD':     { color: '#6366F1', glow: 'rgba(99,102,241,0.35)' },
  Cloud:       { color: '#0EA5E9', glow: 'rgba(14,165,233,0.35)' },
  Databases:   { color: '#14B8A6', glow: 'rgba(20,184,166,0.35)' },
  Other:       { color: '#94A3B8', glow: 'rgba(148,163,184,0.35)' },
};

// Speeds and directions for each row to create visual variety
const rowConfigs = [
  { speed: 55, direction: 'left'  },
  { speed: 65, direction: 'right' },
  { speed: 50, direction: 'left'  },
  { speed: 70, direction: 'right' },
  { speed: 58, direction: 'left'  },
  { speed: 62, direction: 'right' },
  { speed: 53, direction: 'left'  },
  { speed: 68, direction: 'right' },
  { speed: 56, direction: 'left'  },
];

export default function SkillsSection({ grouped, config, categories: orderedCategories }: { grouped: Record<string, Skill[]>, config?: any, categories?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [grouped]);

  const categories = (orderedCategories || Object.keys(grouped || {})).filter(cat => grouped[cat] && grouped[cat].length > 0);

  // Distribute skills into marquee rows — mix categories across rows for visual richness
  const marqueeRows = useMemo(() => {
    const allSkills = categories.flatMap(cat =>
      grouped[cat].map(s => ({ ...s, category: cat }))
    );
    if (allSkills.length === 0) return [];

    // Create 3-4 rows depending on skill count
    const rowCount = Math.max(3, Math.min(5, Math.ceil(allSkills.length / 5)));
    const rows: (Skill & { category: string })[][] = Array.from({ length: rowCount }, () => []);

    // Distribute skills round-robin across rows
    allSkills.forEach((skill, i) => {
      rows[i % rowCount].push(skill);
    });

    // Ensure each row has enough items for a smooth marquee on all screen sizes
    return rows.map(row => {
      while (row.length < 14) {
        row = [...row, ...row];
      }
      return row;
    });
  }, [grouped, categories]);

  const totalSkills = categories.reduce((sum, cat) => sum + grouped[cat].length, 0);

  return (
    <section id="skills" className="section sk-section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{config?.title || "QA & Automation Toolkit"}</span>
          <h2 className="section-title fade-in delay-1">{config?.subtitle || "Tools & Technologies I Use"}</h2>
          <p className="section-desc fade-in delay-2">Battle-tested tools and frameworks from real-world QA experience</p>
        </div>
      </div>

      {/* Marquee Section — full-width, no container constraint */}
      {marqueeRows.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No skills added yet.</p>
      ) : (
        <div className="sk-marquee-wrapper fade-in delay-3">
          {marqueeRows.map((row, rowIdx) => {
            const cfg = rowConfigs[rowIdx % rowConfigs.length];
            const isReverse = cfg.direction === 'right';
            const speedScale = 50 / (config?.marqueeSpeed || 50);
            const finalSpeed = cfg.speed * speedScale;
            // Duplicate row content 2x for seamless loop (row already has 14+ items)
            const items = [...row, ...row];
            return (
              <div key={rowIdx} className="sk-marquee-row">
                <div
                  className={`sk-marquee-track ${isReverse ? 'sk-reverse' : ''}`}
                  style={{ '--marquee-speed': `${finalSpeed}s` } as React.CSSProperties}
                >
                  {items.map((skill, i) => {
                    const meta = categoryMeta[skill.category] || categoryMeta.Other;
                    return (
                      <div
                        key={`${skill._id}-${i}`}
                        className="sk-marquee-item"
                        style={{ '--item-color': meta.color, '--item-glow': meta.glow } as React.CSSProperties}
                      >
                        <span className="sk-item-dot" />
                        {skill.iconUrl && (
                          <Image
                            src={skill.iconUrl}
                            alt={skill.name}
                            width={28}
                            height={28}
                            className="sk-item-icon"
                          />
                        )}
                        <span className="sk-item-name">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Stats */}
      {categories.length > 0 && (
        <div className="container">
          <div className="sk-bottom-stats fade-in delay-4">
            {categories.map(cat => {
              const meta = categoryMeta[cat] || categoryMeta.Other;
              return (
                <div key={cat} className="sk-stat-chip" style={{ '--stat-color': meta.color } as React.CSSProperties}>
                  <span className="sk-stat-dot" />
                  <span className="sk-stat-name">{cat}</span>
                  <span className="sk-stat-count">{grouped[cat].length}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        /* ── Section ─────────────────────── */
        .sk-section {
          position: relative;
          overflow: hidden;
        }

        /* ── Marquee Wrapper ─────────────── */
        .sk-marquee-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem 0;
          /* Edge fade masks */
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        /* ── Marquee Row ─────────────────── */
        .sk-marquee-row {
          overflow: hidden;
          width: 100%;
        }

        /* ── Marquee Track ───────────────── */
        .sk-marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: sk-scroll var(--marquee-speed, 40s) linear infinite;
        }
        .sk-marquee-track.sk-reverse {
          animation-name: sk-scroll-reverse;
        }

        /* No pause on hover as per request */

        @keyframes sk-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes sk-scroll-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        /* ── Marquee Item (Skill Pill) ───── */
        .sk-marquee-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.7rem 1.3rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-full);
          white-space: nowrap;
          flex-shrink: 0;
          cursor: default;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .sk-item-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--item-color);
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--item-glow);
        }

        .sk-item-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .sk-item-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          letter-spacing: 0.01em;
        }

        /* ── Bottom Category Stats ───────── */
        .sk-bottom-stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 3.5rem;
        }

        .sk-stat-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-full);
          transition: all 0.3s ease;
        }
        .sk-stat-chip:hover {
          border-color: var(--stat-color);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 16px color-mix(in srgb, var(--stat-color) 20%, transparent);
        }

        .sk-stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--stat-color);
          box-shadow: 0 0 6px var(--stat-color);
        }
        .sk-stat-name {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .sk-stat-count {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--stat-color);
          background: color-mix(in srgb, var(--stat-color) 10%, transparent);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          min-width: 1.4rem;
          text-align: center;
        }

        /* ── Responsive ──────────────────── */
        @media (max-width: 768px) {
          .sk-marquee-wrapper { gap: 0.75rem; }
          .sk-marquee-track { gap: 0.75rem; }
          .sk-marquee-item {
            padding: 0.55rem 1rem;
          }
          .sk-item-name { font-size: 0.82rem; }
          .sk-item-icon { width: 20px; height: 20px; }
          .sk-bottom-stats { gap: 0.5rem; margin-top: 2.5rem; }
          .sk-stat-chip { padding: 0.4rem 0.75rem; }
          .sk-stat-name { font-size: 0.72rem; }
        }
      `}</style>
    </section>
  );
}
