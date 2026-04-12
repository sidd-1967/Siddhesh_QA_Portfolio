'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

interface Stats {
  projects: number;
  experience: number;
  skills: number;
  education: number;
  certifications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, experience: 0, skills: 0, education: 0, certifications: 0 });
  const [profileName, setProfileName] = useState('');
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [proj, exp, skills, edu, certs, profile, settingsRes] = await Promise.all([
          adminAPI.getProjects(),
          adminAPI.getExperience(),
          adminAPI.getSkills(),
          adminAPI.getEducation(),
          adminAPI.getCertifications(),
          adminAPI.getProfile(),
          adminAPI.getSettings(),
        ]);
        setStats({
          projects: proj.data.data.length,
          experience: exp.data.data.length,
          skills: skills.data.data.length,
          education: edu.data.data.length,
          certifications: certs.data.data.length,
        });
        setProfileName(profile.data.data?.fullName || '');
        setConfig(settingsRes.data.data);
      } catch {
        // handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const toggleSectionConfig = async (key: string, enabled: boolean) => {
    if (!config) return;
    const newConfig = { ...config };
    newConfig.sectionHeaders[key].enabled = enabled;
    setConfig(newConfig);
    try {
      await adminAPI.updateSettings(newConfig);
    } catch {
      newConfig.sectionHeaders[key].enabled = !enabled;
      setConfig({ ...newConfig });
    }
  };

  const cards = [
    { label: 'Projects', value: stats.projects, href: '/qaportfolioadmin/projects', color: '#00D4FF' },
    { label: 'Experience', value: stats.experience, href: '/qaportfolioadmin/experience', color: '#22D3A5' },
    { label: 'Skills', value: stats.skills, href: '/qaportfolioadmin/skills', color: '#7B5FFD' },
    { label: 'Education', value: stats.education, href: '/qaportfolioadmin/education', color: '#F59E0B' },
    { label: 'Certifications', value: stats.certifications, href: '/qaportfolioadmin/certifications', color: '#EC4899' },
  ];

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">Welcome back{profileName ? `, ${profileName.split(' ')[0]}` : ''}! Manage your portfolio here.</p>
        </div>
        <a href="/" target="_blank" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
          View Portfolio ↗
        </a>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="dash-grid">
          {cards.map((card) => (
            <a key={card.label} href={card.href} className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: `${card.color}18`, border: `1px solid ${card.color}33` }}>
                <span style={{ fontSize: '1.4rem', color: card.color, fontWeight: 800 }}>{card.value}</span>
              </div>
              <div>
                <p className="dash-stat-label">{card.label}</p>
                <p className="dash-stat-hint">Click to manage →</p>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="dash-quick-actions">
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-actions-grid">
          {[
            { label: 'Add Project', href: '/qaportfolioadmin/projects', desc: 'Showcase a new project' },
            { label: 'Add Experience', href: '/qaportfolioadmin/experience', desc: 'Log a work history entry' },
            { label: 'Add Skill', href: '/qaportfolioadmin/skills', desc: 'Add to your tech stack' },
            { label: 'Add Certification', href: '/qaportfolioadmin/certifications', desc: 'Add a new credential' },
            { label: 'Edit Profile', href: '/qaportfolioadmin/profile', desc: 'Update your public info' },
          ].map((action) => (
            <a key={action.label} href={action.href} className="dash-action card">
              <p className="dash-action-label">{action.label}</p>
              <p className="dash-action-desc">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="dash-quick-actions" style={{ marginTop: '2.5rem' }}>
        <h2 className="dash-section-title">Section Visibility Overview</h2>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Section</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', width: '120px' }}>Toggle</th>
              </tr>
            </thead>
            <tbody>
              {config && Object.entries(config.sectionHeaders).map(([key, header]: [string, any]) => (
                <tr key={key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`tag ${header.enabled !== false ? 'tag-enabled' : 'tag-disabled'}`}>
                      {header.enabled !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <label className="toggle-switch" title={`Toggle ${key} section visibility`}>
                      <input 
                        type="checkbox" 
                        checked={header.enabled !== false} 
                        onChange={(e) => toggleSectionConfig(key, e.target.checked)} 
                      />
                      <div className="toggle-slider"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .dash-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.25rem; }
        .dash-sub { font-size: 0.9rem; color: var(--color-text-muted); }
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .dash-stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          text-decoration: none;
          color: inherit;
        }
        .dash-stat-icon {
          width: 52px; height: 52px;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dash-stat-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); }
        .dash-stat-hint { font-size: 0.72rem; color: var(--color-text-muted); margin-top: 0.15rem; }
        .dash-section-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
        .dash-quick-actions { margin-top: 2rem; }
        .dash-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .dash-action {
          padding: 1.25rem;
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .dash-action-label { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
        .dash-action-desc { font-size: 0.78rem; color: var(--color-text-muted); }
        .tag-enabled { background: rgba(34,211,165,0.1); color: var(--color-success); border-color: rgba(34,211,165,0.2); }
        .tag-disabled { background: rgba(255,107,107,0.1); color: var(--color-error); border-color: rgba(255,107,107,0.2); }
      `}</style>
    </div>
  );
}
