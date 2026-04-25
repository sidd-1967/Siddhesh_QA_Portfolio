'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface Profile {
  fullName: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  yearsOfExperience?: number;
  avatarUrl?: string;
  openToWork?: boolean;
}

export default function AboutSection({ profile, config, aboutStats }: { profile: Profile | null, config?: any, aboutStats?: any[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const sectionTag = config?.title || "DELIVERING QUALITY THROUGH PRECISION TESTING";
  const sectionTitle = config?.subtitle || "Professional Summary";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.fade-in, .slide-in-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = aboutStats || [
    { label: 'Years Exp', value: profile?.yearsOfExperience ? `${profile.yearsOfExperience}+` : '3+' },
    { label: 'Projects', value: '15+' },
    { label: 'Test Cases', value: '500+' },
    { label: 'Auto Coverage', value: '80%' },
  ];

  return (
    <section id="about" className="section ab-section" ref={ref}>
      <div className="container">
        <div className="ab-container fade-in">
          
          {/* Left Column: Info */}
          <div className="ab-info-col">
            <div className="ab-header-group">
              <span className="ab-pre-title">{sectionTag}</span>
              <h2 className="ab-main-title">{sectionTitle}</h2>
            </div>

            <div 
              className="ab-bio-content ql-editor"
              dangerouslySetInnerHTML={{ __html: profile?.bio || "" }}
            />

            <div className="ab-contact-list">
              <div className="ab-contact-item">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{profile?.location || 'Mumbai, Maharashtra'}</span>
              </div>
              <div className="ab-contact-item">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>{profile?.email}</span>
              </div>
              {profile?.phone && (
                <div className="ab-contact-item">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>

            <a href="#contact" className="ab-work-btn">
              Let&apos;s work together <span>→</span>
            </a>
          </div>

          {/* Right Column: Visual & Stats */}
          <div className="ab-visual-col">
            <div className="ab-image-box">
              {profile?.avatarUrl ? (
                <Image 
                  src={profile.avatarUrl} 
                  alt={profile.fullName} 
                  fill 
                  className="ab-profile-img" 
                  priority
                />
              ) : (
                <div className="ab-placeholder">SDG</div>
              )}
              {profile?.openToWork && (
                <div className="ab-work-badge">
                  <span className="ab-badge-dot" /> Open to work
                </div>
              )}
            </div>

            <div className="ab-stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="ab-stat-box">
                  <span className="ab-stat-value">{stat.value}</span>
                  <span className="ab-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .ab-section {
          padding: 6rem 0;
        }

        .ab-container {
          background: var(--color-bg-2);
          border: 1px solid var(--color-border);
          border-radius: 24px;
          display: grid;
          grid-template-columns: 1fr 400px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }

        /* --- Info Column --- */
        .ab-info-col {
          padding: 4rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border-right: 1px solid var(--color-border);
        }

        .ab-pre-title {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }

        .ab-main-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.1;
        }

        .ab-bio-content {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        .ab-bio-content strong {
          color: var(--color-text-primary);
          font-weight: 700;
        }

        .ab-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .ab-contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .ab-contact-item svg {
          color: var(--color-text-muted);
        }

        .ab-work-btn {
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.75rem;
          background: rgba(0, 212, 255, 0.08);
          border: 1.5px solid rgba(0, 212, 255, 0.3);
          border-radius: 12px;
          color: var(--color-text-primary);
          font-weight: 600;
          text-decoration: none;
          width: fit-content;
          transition: all 0.3s;
        }

        .ab-work-btn:hover {
          background: var(--color-accent);
          color: var(--color-text-inverse);
          border-color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 212, 255, 0.2);
        }

        .ab-work-btn span {
          transition: transform 0.3s;
        }

        .ab-work-btn:hover span {
          transform: translateX(4px);
        }

        /* --- Visual Column --- */
        .ab-visual-col {
          display: flex;
          flex-direction: column;
        }

        .ab-image-box {
          height: 380px;
          background: var(--color-bg);
          position: relative;
          border-bottom: 1px solid var(--color-border);
        }

        .ab-profile-img {
          object-fit: cover;
        }

        .ab-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-weight: 800;
          color: var(--color-bg-card);
          background: linear-gradient(135deg, var(--color-bg), var(--color-bg-2));
        }

        .ab-work-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(10, 15, 30, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid var(--color-success);
          color: var(--color-success);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ab-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--color-success);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--color-success);
        }

        .ab-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
        }

        .ab-stat-box {
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
          border-right: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .ab-stat-box:nth-child(2n) {
          border-right: none;
        }

        .ab-stat-box:nth-child(n+3) {
          border-bottom: none;
        }

        .ab-stat-value {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1;
        }

        .ab-stat-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* --- Responsive --- */
        @media (max-width: 1100px) {
          .ab-container {
            grid-template-columns: 1fr 340px;
          }
          .ab-info-col {
            padding: 3rem;
          }
        }

        @media (max-width: 900px) {
          .ab-pre-title {
            content: "";
          }
          .ab-pre-title::after {
            content: "QA ENGINEER · MUMBAI";
          }
          .ab-container {
            grid-template-columns: 1fr 300px;
          }
          .ab-info-col {
            padding: 2rem;
            gap: 1.5rem;
          }
          .ab-main-title {
            font-size: 1.8rem;
          }
          .ab-image-box {
            height: 280px;
          }
          .ab-stat-box {
            padding: 1.5rem 1rem;
          }
          .ab-stat-value {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .ab-container {
            grid-template-columns: 1fr;
          }
          .ab-info-col {
            padding: 2.5rem 1.5rem;
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            order: 2;
          }
          .ab-visual-col {
            order: 1;
          }
          .ab-image-box {
            height: 320px;
          }
          .ab-stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: var(--color-bg);
          }
          .ab-stat-box {
            padding: 2rem 1rem;
            align-items: center;
            text-align: center;
          }
          .ab-pre-title::after {
            content: "QA ENGINEER · MUMBAI";
          }
        }

        @media (max-width: 480px) {
          .ab-info-col {
            padding: 2rem 1.25rem;
          }
          .ab-main-title {
            font-size: 1.75rem;
          }
          .ab-stats-grid {
            gap: 1px;
            background: var(--color-border);
          }
          .ab-stat-box {
            background: var(--color-bg-2);
            padding: 1.25rem 0.5rem;
            border: none;
          }
        }
      `}</style>
    </section>
  );
}
