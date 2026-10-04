'use client';

import { useEffect, useState } from 'react';

export default function LandscapeBlocker() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => {
      // Trigger when viewport is landscape AND narrower than a real desktop (< 1025px)
      // No touch-device check needed — viewport size is sufficient to exclude real desktops
      const landscape = window.innerWidth > window.innerHeight && window.innerWidth < 1025;
      setIsLandscape(landscape);
    };

    check();
    if (screen.orientation) screen.orientation.addEventListener("change", check);
    window.addEventListener("resize", check);
    return () => {
      if (screen.orientation) screen.orientation.removeEventListener("change", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="lsb-overlay" aria-live="polite" role="alert">
      <div className="lsb-icon-wrap">
        <svg className="lsb-phone" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="4" width="40" height="24" rx="5" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="28" cy="16" r="3" fill="currentColor" opacity="0.5" />
        </svg>
        <span className="lsb-arrow" aria-hidden="true">&#8635;</span>
        <svg className="lsb-phone lsb-phone--portrait" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="4" width="24" height="40" rx="5" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="28" cy="38" r="3" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
      <h2 className="lsb-title">My Layout Failed Landscape QA 😅</h2>
      <p className="lsb-desc">
        Turns out, landscape mode didn't pass my own QA checks. 🤔<br />
        Flip your phone upright and let's get back on track.
      </p>
      <style>{`
        .lsb-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: #05060f;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 24px; padding: 32px;
          animation: lsb-fade-in 0.3s ease;
        }
        @keyframes lsb-fade-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .lsb-icon-wrap { display: flex; align-items: center; gap: 20px; color: #00D4FF; }
        .lsb-phone { width: 64px; height: 64px; opacity: 0.4; }
        .lsb-phone--portrait {
          opacity: 1;
          filter: drop-shadow(0 0 12px rgba(0,212,255,0.6));
        }
        .lsb-arrow {
          font-size: 2.8rem; color: #00D4FF; line-height: 1; display: block;
          animation: lsb-spin 1.8s ease-in-out infinite;
        }
        @keyframes lsb-spin {
          0%   { transform: rotate(0deg)   scale(1);   opacity: 0.4; }
          50%  { transform: rotate(180deg) scale(1.1); opacity: 1;   }
          100% { transform: rotate(360deg) scale(1);   opacity: 0.4; }
        }
        .lsb-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.2rem, 5vw, 1.6rem);
          font-weight: 800; color: #e8ecf6;
          text-align: center; margin: 0; line-height: 1.2;
        }
        .lsb-desc {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.85rem, 3vw, 1rem);
          color: #8892b0; text-align: center; margin: 0; line-height: 1.7;
        }
      `}</style>
    </div>
  );
}
