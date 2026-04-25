'use client';
import { useState, useEffect } from 'react';
import CrudPage from '@/components/admin/CrudPage';
import SkillForm from '@/components/admin/SkillForm';
import { adminAPI } from '@/lib/api';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: string;
  order: number;
}

export default function AdminSkillsPage() {
  const [marqueeSpeed, setMarqueeSpeed] = useState(50);
  const [savingSpeed, setSavingSpeed] = useState(false);
  const [speedSaved, setSpeedSaved] = useState(false);

  useEffect(() => {
    adminAPI.getSettings().then(res => {
      const speed = res.data.data.sectionHeaders?.skills?.marqueeSpeed;
      if (speed !== undefined) {
        setMarqueeSpeed(speed);
      }
    }).catch(err => console.error("Failed to fetch settings:", err));
  }, []);

  const handleSaveSpeed = async () => {
    setSavingSpeed(true);
    try {
      const res = await adminAPI.getSettings();
      const settings = res.data.data;
      
      if (!settings.sectionHeaders.skills) {
        settings.sectionHeaders.skills = { title: 'Skills', subtitle: '', marqueeSpeed: 50 };
      }
      
      settings.sectionHeaders.skills.marqueeSpeed = marqueeSpeed;
      await adminAPI.updateSettings(settings);
      setSpeedSaved(true);
      setTimeout(() => setSpeedSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update speed:", err);
      alert("Failed to save marquee speed");
    } finally {
      setSavingSpeed(false);
    }
  };

  return (
    <>
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Marquee Animation Settings
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Scrolling Speed
              </label>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                {marqueeSpeed === 10 ? 'Slowest' : marqueeSpeed === 150 ? 'Fastest' : `${marqueeSpeed}%`}
              </span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="150" 
              value={marqueeSpeed} 
              onChange={(e) => setMarqueeSpeed(parseInt(e.target.value))}
              style={{ 
                width: '100%', 
                accentColor: 'var(--color-accent)',
                height: '6px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              <span>Slow</span>
              <span>Default (50)</span>
              <span>Fast</span>
            </div>
          </div>
          <button 
            className={`btn ${speedSaved ? 'btn-success' : 'btn-primary'}`}
            onClick={handleSaveSpeed}
            disabled={savingSpeed}
            style={{ minWidth: '120px' }}
          >
            {savingSpeed ? 'Saving...' : speedSaved ? '✓ Saved' : 'Save Speed'}
          </button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
          Adjust the overall scrolling speed of your skills marquee. 
          Higher values scroll faster, lower values scroll slower. 
          <strong> Default is 50.</strong>
        </p>
      </div>

      <CrudPage<Skill>
        title="Skills"
        fetchFn={() => adminAPI.getSkills() as Promise<{ data: { data: Skill[] } }>}
        createFn={(d) => adminAPI.createSkill(d)}
        updateFn={(id, d) => adminAPI.updateSkill(id, d)}
        deleteFn={(id) => adminAPI.deleteSkill(id)}
        columns={[
          { key: 'name', label: 'Skill' },
          { key: 'category', label: 'Category' },
          { key: 'proficiency', label: 'Proficiency' },
          { key: 'order', label: 'Order' },
        ]}
        FormComponent={SkillForm as Parameters<typeof CrudPage<Skill>>[0]['FormComponent']}
        emptyMessage="No skills yet. Build your tech stack!"
        sectionKey="skills"
      />
    </>
  );
}
