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
}

export default function AboutSection({ profile, config, aboutStats }: { profile: Profile | null, config?: any, aboutStats?: any[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const sectionTag = config?.title || "About Me";
  const sectionTitle = config?.subtitle || "Passion for Quality";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = aboutStats || [
    { label: 'Years Experience', value: profile?.yearsOfExperience ? `${profile.yearsOfExperience}+` : '3+' },
    { label: 'Projects Tested', value: '15+' },
    { label: 'Test Cases Written', value: '500+' },
    { label: 'Automation Coverage', value: '80%' },
  ];

  return (
    <section id="about" className="section section-alt" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-in">{sectionTag}</span>
          <h2 className="section-title fade-in delay-1">{sectionTitle}</h2>
        </div>

        <div className="about-grid">
          {/* Avatar / Visual */}
          <div className="about-visual slide-in-left">
            <div className="about-avatar-wrap">
              {profile?.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile?.fullName || 'Profile'} className="about-avatar" width={200} height={200} />
              ) : (
                <div className="about-avatar-placeholder">
                  <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth="1.5">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              )}
              <div className="about-avatar-ring" />
            </div>
          </div>

          {/* Content */}
          <div className="about-content slide-in-right">
            <p className="about-bio">
              {profile?.bio ||
                `I'm a QA Engineer with a strong passion for ensuring software quality through both manual and automated testing. 
I specialize in building robust test frameworks and CI/CD pipelines that catch bugs before they reach production.`}
            </p>

            <div className="about-details">
              {profile?.location && (
                <div className="about-detail">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="about-detail">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>{profile.email}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="about-detail">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>

            <a href="#contact" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
              Let&apos;s Talk
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats fade-in delay-3">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <span className="stat-value gradient-text">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 4rem;
        }
        .about-visual {
          display: flex;
          justify-content: center;
        }
        .about-avatar-wrap {
          position: relative;
          width: 220px; height: 220px;
        }
        .about-avatar {
          width: 200px; height: 200px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-accent);
          position: relative; z-index: 1;
          background: radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(10,14,23,0) 70%);
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.5));
          transition: transform var(--transition-normal);
        }
        .about-avatar:hover {
          transform: scale(1.02);
        }
        .about-avatar-placeholder {
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,0.1) 0%, var(--color-bg-card) 70%);
          border: 2px solid var(--color-accent);
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
        }
        .about-avatar-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px dashed rgba(0,212,255,0.3);
          animation: spin 20s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .about-bio {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.85;
          margin-bottom: 1.5rem;
          white-space: pre-line;
        }
        .about-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .about-detail {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }
        .about-detail svg { color: var(--color-accent); flex-shrink: 0; }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .stat-card {
          text-align: center;
          padding: 1.5rem 1rem;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
        }
        .stat-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-3px);
        }
        .stat-value {
          display: block;
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.375rem;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
          .about-visual { order: -1; }
          .about-details { align-items: center; }
          .about-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
