'use client';
import CrudPage from '@/components/admin/CrudPage';
import EducationForm from '@/components/admin/EducationForm';
import { adminAPI } from '@/lib/api';

interface Education {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;
  grade?: string;
}

export default function AdminEducationPage() {
  return (
    <CrudPage<Education>
      title="Education"
      fetchFn={() => adminAPI.getEducation() as Promise<{ data: { data: Education[] } }>}
      createFn={(d) => adminAPI.createEducation(d)}
      updateFn={(id, d) => adminAPI.updateEducation(id, d)}
      deleteFn={(id) => adminAPI.deleteEducation(id)}
      columns={[
        { key: 'institution', label: 'Institution' },
        { key: 'degree', label: 'Degree' },
        { key: 'field', label: 'Field' },
        { key: 'startYear', label: 'Start Year' },
        { key: 'endYear', label: 'End Year', render: (r) => r.endYear ? String(r.endYear) : 'Present' },
        { key: 'grade', label: 'Grade' },
      ]}
      FormComponent={EducationForm as Parameters<typeof CrudPage<Education>>[0]['FormComponent']}
      emptyMessage="No education entries yet."
    />
  );
}
