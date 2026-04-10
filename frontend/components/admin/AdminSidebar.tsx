'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/lib/auth';
import { adminAPI } from '@/lib/api';

const navItems = [
  {
    label: 'Dashboard',
    href: '/qaportfolioadmin/dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'About Me',
    href: '/qaportfolioadmin/profile',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/qaportfolioadmin/projects',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828a2 2 0 001.414.586H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
      </svg>
    ),
  },
  {
    label: 'Experience',
    href: '/qaportfolioadmin/experience',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    label: 'Skills',
    href: '/qaportfolioadmin/skills',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
      </svg>
    ),
  },
  {
    label: 'Education',
    href: '/qaportfolioadmin/education',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z"/>
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
      </svg>
    ),
  },
  {
    label: 'Certifications',
    href: '/qaportfolioadmin/certifications',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/qaportfolioadmin/settings',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [initials, setInitials] = useState('SK');

  useEffect(() => {
    adminAPI.getProfile().then(res => {
      const name = res.data.data?.fullName;
      if (name) {
        const parts = name.split(' ');
        const ini = parts.map((n: string) => n[0]).join('').toUpperCase();
        setInitials(ini);
      }
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    AuthService.clearToken();
    router.push('/qaportfolioadmin/login');
  };

  return (
    <aside className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <span className="gradient-text" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{initials}</span>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">Admin Portal</span>
              <span className="sidebar-brand-sub">Portfolio Manager</span>
            </div>
          </div>
        )}
        <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d={collapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}/>
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link${pathname === item.href || pathname.startsWith(item.href + '/') ? ' active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link href="/" className="sidebar-link" target="_blank" title={collapsed ? 'View Site' : undefined}>
          <span className="sidebar-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </span>
          {!collapsed && <span className="sidebar-label">View Site</span>}
        </Link>
        <button className="sidebar-link sidebar-logout" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <span className="sidebar-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 260px;
          background: #0d1526;
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          z-index: var(--z-sticky);
          transition: width 0.3s ease;
        }
        .sidebar-collapsed { width: 68px; }
        .sidebar-header {
          padding: 1.25rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          min-height: 72px;
        }
        .sidebar-brand { display: flex; align-items: center; gap: 0.75rem; }
        .sidebar-brand-text { display: flex; flex-direction: column; }
        .sidebar-brand-name { font-size: 0.875rem; font-weight: 700; color: var(--color-text-primary); }
        .sidebar-brand-sub { font-size: 0.7rem; color: var(--color-text-muted); }
        .sidebar-collapse-btn {
          background: none; border: none;
          color: var(--color-text-muted);
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .sidebar-collapse-btn:hover { color: var(--color-accent); background: rgba(0,212,255,0.08); }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          background: none;
          border: none;
          width: 100%;
          white-space: nowrap;
          cursor: pointer;
        }
        .sidebar-link:hover {
          color: var(--color-accent);
          background: rgba(0,212,255,0.08);
        }
        .sidebar-link.active {
          color: var(--color-accent);
          background: rgba(0,212,255,0.12);
          border: 1px solid rgba(0,212,255,0.15);
        }
        .sidebar-icon { flex-shrink: 0; display: flex; }
        .sidebar-footer {
          padding: 0.75rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sidebar-logout { color: var(--color-text-muted); }
        .sidebar-logout:hover { color: var(--color-error); background: rgba(255,107,107,0.08); }
        @media (max-width: 768px) {
          .sidebar { width: 68px; }
          .sidebar-label, .sidebar-brand-text { display: none; }
        }
      `}</style>
    </aside>
  );
}
