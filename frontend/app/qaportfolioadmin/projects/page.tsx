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

// Strip HTML tags AND decode entities (e.g. &nbsp;) using DOMParser
function stripHtml(html: string, maxLen = 80): string {
  if (!html) return '—';
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const plain = (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain;
  } catch {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLen);
  }
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
        { key: 'description', label: 'Description', render: (r) => stripHtml(r.description) },
        { key: 'techStack', label: 'Tech Stack' },
        { key: 'featured', label: 'Featured' },
        { key: 'order', label: 'Order' },
      ]}
      FormComponent={ProjectForm as Parameters<typeof CrudPage<Project>>[0]['FormComponent']}
      emptyMessage="No projects yet. Add your first project!"
      sectionKey="projects"
    />
  );
}
