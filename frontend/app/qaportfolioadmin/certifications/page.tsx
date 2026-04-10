'use client';
import CrudPage from '@/components/admin/CrudPage';
import CertificationForm from '@/components/admin/CertificationForm';
import { adminAPI } from '@/lib/api';

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string;
}

function formatDate(d?: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function AdminCertificationsPage() {
  return (
    <CrudPage<Certification>
      title="Certifications"
      fetchFn={() => adminAPI.getCertifications() as Promise<{ data: { data: Certification[] } }>}
      createFn={(d) => adminAPI.createCertification(d)}
      updateFn={(id, d) => adminAPI.updateCertification(id, d)}
      deleteFn={(id) => adminAPI.deleteCertification(id)}
      columns={[
        { key: 'name', label: 'Certification' },
        { key: 'issuer', label: 'Issuer' },
        { key: 'issueDate', label: 'Issued', render: (r) => formatDate(r.issueDate) },
        { key: 'expiryDate', label: 'Expires', render: (r) => formatDate(r.expiryDate) },
        { key: 'credentialId', label: 'Credential ID' },
      ]}
      FormComponent={CertificationForm as Parameters<typeof CrudPage<Certification>>[0]['FormComponent']}
      emptyMessage="No certifications yet."
    />
  );
}
