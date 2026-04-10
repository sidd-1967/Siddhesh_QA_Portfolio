'use client';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export default function NavBar({ profile }: { profile: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const fullName = profile?.fullName || 'Siddhesh Govalkar';
  const firstName = fullName.split(' ')[0];
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  // Close menu on link click
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    setMenuOpen(false);
    if (href === '#hero') {
      handleLogoClick(e);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  return (
    <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <a href="#hero" className="navbar-logo" onClick={handleLogoClick}>
          <span className="gradient-text">{initials}</span>
          <span className="navbar-logo-text">{firstName}</span>
        </a>

        {/* Desktop nav */}
        <ul className="navbar-links hide-mobile">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`navbar-link${activeSection === link.href.slice(1) ? ' active' : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions hide-mobile">
          <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Let's Talk
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger hide-desktop"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile sidebar/drawer menu */}
      <div className={`mobile-sidebar${menuOpen ? ' open' : ''}`}>
        <div className="mobile-sidebar-header">
          <a href="#hero" className="navbar-logo" onClick={handleLogoClick}>
            <span className="gradient-text">{initials}</span>
            <span className="navbar-logo-text">{firstName}</span>
          </a>
          <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mobile-sidebar-nav">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-sidebar-link"
              onClick={(e) => handleNavClick(e, link.href)}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <span className="link-num">0{i + 1}.</span>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mobile-sidebar-footer">
          <p className="footer-label">Connect with me</p>
          <div className="social-mini">
            {profile?.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank">LinkedIn</a>}
            {profile?.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank">GitHub</a>}
          </div>
          <a href="#contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} onClick={(e) => handleNavClick(e, '#contact')}>
            Get In Touch
          </a>
        </div>
      </div>

      {/* Backdrop overlay */}
      <div className={`mobile-backdrop${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: var(--z-sticky);
          padding: 1.25rem 0;
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(10,15,30,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
          padding: 0.875rem 0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          text-decoration: none;
        }
        .navbar-logo-text {
          color: var(--color-text-primary);
          font-size: 1rem;
          font-weight: 500;
        }
        .navbar-links {
          display: flex;
          list-style: none;
          gap: 0.25rem;
        }
        .navbar-link {
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          text-decoration: none;
        }
        .navbar-link:hover, .navbar-link.active {
          color: var(--color-accent);
          background: rgba(0,212,255,0.08);
        }
        .navbar-actions { display: flex; gap: 0.75rem; align-items: center; }
        .hamburger {
          background: none; border: none;
          display: flex; flex-direction: column; gap: 5px;
          padding: 10px; cursor: pointer;
        }
        .hamburger-line {
          display: block; width: 22px; height: 2px;
          background: var(--color-text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        /* --- Mobile Sidebar --- */
        .mobile-sidebar {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(400px, 85vw);
          background: rgba(10, 15, 30, 0.95);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          z-index: 1001;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 1px solid var(--color-border);
        }
        .mobile-sidebar.open { transform: translateX(0); }

        .mobile-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3.5rem;
        }
        .close-btn {
          background: none; border: none;
          color: var(--color-text-primary);
          padding: 5px; cursor: pointer;
          transition: transform 0.3s ease;
        }
        .close-btn:hover { transform: rotate(90deg); color: var(--color-accent); }

        .mobile-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 1;
        }
        .mobile-sidebar-link {
          font-size: clamp(1.5rem, 6vw, 2.2rem);
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--color-text-primary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.4s ease;
        }
        .mobile-sidebar.open .mobile-sidebar-link {
          opacity: 1;
          transform: translateX(0);
        }
        .link-num {
          font-size: 0.875rem;
          font-family: var(--font-body);
          color: var(--color-accent);
          font-weight: 500;
        }
        .mobile-sidebar-link:hover { color: var(--color-accent); padding-left: 0.5rem; }

        .mobile-sidebar-footer {
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }
        .footer-label { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
        .social-mini { display: flex; gap: 1.5rem; }
        .social-mini a { font-size: 0.9rem; color: var(--color-text-secondary); font-weight: 500; }
        .social-mini a:hover { color: var(--color-accent); }

        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
        }
        .mobile-backdrop.open { opacity: 1; visibility: visible; }

        @media (max-width: 480px) {
          .mobile-sidebar { width: 100%; border-left: none; }
        }
      `}</style>
    </nav>
  );
}
