'use client';
import { useEffect, useRef } from 'react';

interface Profile {
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  location: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  resumeUrl?: string;
  heroBio?: string;
  openToWork?: boolean;
}

export default function HeroSection({ profile, config }: { profile: Profile | null, config?: any }) {
  const particlesRef = useRef<HTMLCanvasElement>(null);

  // Simple particle canvas animation
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('#hero .fade-in');
      elements.forEach((el) => el.classList.add('visible'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const name = profile?.fullName || 'Siddhesh Govalkar';
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');

  const titleTemplate = config?.title || "Hi, I'm {name}";
  const headline = profile?.headline || config?.subtitle || 'QA Engineer | Test Automation Specialist';
  
  const github = profile?.socialLinks?.github;
  const linkedin = profile?.socialLinks?.linkedin;
  const resumeUrl = profile?.resumeUrl;

  return (
    <section id="hero" className="hero-section">
      <canvas ref={particlesRef} className="hero-canvas" aria-hidden="true" />

      {/* Gradient orbs */}
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />

      <div className="container hero-content">
        {profile?.openToWork && (
          <div className="hero-badge fade-in">
            <span className="hero-badge-dot" />
            Open to Work
          </div>
        )}

        <h1 className="hero-name fade-in delay-1">
          {titleTemplate.includes('{name}') ? (
            <>
              {titleTemplate.split('{name}')[0]}
              <span className="gradient-text">{firstName}</span>
              {titleTemplate.split('{name}')[1]}
            </>
          ) : (
            titleTemplate
          )}
          <br />
          {lastName}
        </h1>

        <p className="hero-headline fade-in delay-2">{headline}</p>

        <p className="hero-bio fade-in delay-3">
          {profile?.heroBio || (profile?.bio ? profile.bio.split('\n')[0] : 'Passionate QA engineer ensuring software quality through meticulous test automation and strategic testing.')}
        </p>

        <div className="hero-actions fade-in delay-4">
          <a href="#contact" className="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Get in Touch
          </a>
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download CV
            </a>
          )}
        </div>

        <div className="hero-social fade-in delay-5">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="GitHub">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="LinkedIn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          <a href={`mailto:${profile?.email || ''}`} className="hero-social-link" aria-label="Email">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </a>
        </div>

        <div className="hero-scroll-indicator" aria-hidden="true">
          <div className="hero-scroll-dot" />
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          overflow: hidden;
        }
        .hero-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,212,255,0.12), transparent 70%);
          top: -100px; left: -100px;
          animation: floatOrb 8s ease-in-out infinite alternate;
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(123,95,253,0.1), transparent 70%);
          bottom: 0; right: -50px;
          animation: floatOrb 10s ease-in-out infinite alternate-reverse;
        }
        @keyframes floatOrb {
          from { transform: translate(0, 0); }
          to   { transform: translate(30px, 20px); }
        }
        .hero-content {
          position: relative;
          z-index: 1;
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          background: rgba(34,211,165,0.1);
          border: 1px solid rgba(34,211,165,0.3);
          color: var(--color-success);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .hero-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-success);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        .hero-name {
          font-size: clamp(2.5rem, 7vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .hero-headline {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          font-weight: 500;
          color: var(--color-accent);
          margin-bottom: 1.25rem;
          letter-spacing: 0.02em;
        }
        .hero-bio {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          max-width: 560px;
          margin-bottom: 2.5rem;
          line-height: 1.8;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .hero-social {
          display: flex;
          gap: 0.75rem;
        }
        .hero-social-link {
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          transition: all var(--transition-normal);
        }
        .hero-social-link:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
          background: rgba(0,212,255,0.08);
          transform: translateY(-2px);
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
        }
        .hero-scroll-dot {
          width: 4px; height: 24px;
          background: linear-gradient(to bottom, var(--color-accent), transparent);
          border-radius: 2px;
          animation: scrollBounce 1.5s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(8px); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
