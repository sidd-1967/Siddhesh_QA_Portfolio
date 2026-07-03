"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppConfig } from '@/config/app.config';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const pathname = window.location.pathname;
    
    // Check if the invalid URL is under the admin portal
    if (pathname.startsWith('/qaportfolioadmin')) {
      const token = localStorage.getItem(AppConfig.admin.tokenKey);
      if (token) {
        // Logged in
        router.replace(AppConfig.admin.dashboardPath);
      } else {
        // Logged out
        router.replace(AppConfig.admin.loginPath);
      }
    } else {
      // Frontend site - redirect to home
      router.replace('/');
    }
  }, [router]);

  // Render nothing while redirecting
  return null;
}
