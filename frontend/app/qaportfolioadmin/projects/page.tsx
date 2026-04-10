'use client';
import CrudPage from '@/components/admin/CrudPage';
import ProjectForm from '@/components/admin/ProjectForm';
import { adminAPI } from '@/lib/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  featured: boolean;
  order: number;
}

export default function AdminProjectsPage() {
  return (
    <CrudPage<Project>
      title="Projects"
      fetchFn={() => adminAPI.getProjects() as Promise<{ data: { data: Project[] } }>}
      createFn={(data) => adminAPI.createProject(data)}
      updateFn={(id, data) => adminAPI.updateProject(id, data)}
      deleteFn={(id) => adminAPI.deleteProject(id)}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'techStack', label: 'Tech Stack' },
        { key: 'featured', label: 'Featured' },
        { key: 'order', label: 'Order' },
      ]}
      FormComponent={ProjectForm as Parameters<typeof CrudPage<Project>>[0]['FormComponent']}
      emptyMessage="No projects yet. Add your first project!"
    />
  );
}
