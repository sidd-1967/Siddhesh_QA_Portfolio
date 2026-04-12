'use client';
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
  return (
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
  );
}
