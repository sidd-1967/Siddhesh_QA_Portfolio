'use client';
import CrudPage from '@/components/admin/CrudPage';
import ExperienceForm from '@/components/admin/ExperienceForm';
import { adminAPI } from '@/lib/api';

interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  location?: string;
}

function formatDate(d?: string | null) {
  if (!d) return 'Present';
  // Handle YYYY-MM format
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(d)) {
    const [year, month] = d.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1)
      .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function AdminExperiencePage() {
  return (
    <CrudPage<Experience>
      title="Experience"
      fetchFn={() => adminAPI.getExperience() as Promise<{ data: { data: Experience[] } }>}
      createFn={(d) => adminAPI.createExperience(d)}
      updateFn={(id, d) => adminAPI.updateExperience(id, d)}
      deleteFn={(id) => adminAPI.deleteExperience(id)}
      columns={[
        { key: 'company', label: 'Company' },
        { key: 'role', label: 'Role' },
        { key: 'startDate', label: 'Start', render: (r) => formatDate(r.startDate) },
        { key: 'endDate', label: 'End', render: (r) => r.current ? 'Present' : formatDate(r.endDate) },
        { key: 'location', label: 'Location' },
      ]}
      FormComponent={ExperienceForm as Parameters<typeof CrudPage<Experience>>[0]['FormComponent']}
      emptyMessage="No work experience added yet."
      sectionKey="experience"
    />
  );
}
