'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/qaportfolioadmin/login';

  useEffect(() => {
    if (!isLoginPage && !AuthService.isAuthenticated()) {
      router.replace('/qaportfolioadmin/login');
    }
    
    // Update document title for admin portal
    const baseTitle = "Admin Portal | Siddhesh Govalkar";
    document.title = isLoginPage ? `Login | ${baseTitle}` : baseTitle;
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="admin-login-wrap">
        {children}
        <style>{`
          .admin-login-wrap {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg);
            padding: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg);
        }
        .admin-main {
          flex: 1;
          margin-left: 260px;
          min-width: 0;
        }
        .admin-content {
          padding: 2rem;
          width: 100%;
          max-width: 100%; /* Utilize full width on big screens */
        }
        @media (max-width: 768px) {
          .admin-main { margin-left: 0; }
          .admin-content { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}
