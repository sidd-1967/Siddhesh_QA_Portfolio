'use client';

import { usePathname } from 'next/navigation';

export default function StarsBackground() {
  const pathname = usePathname();

  // Hide the starfield on all admin routes
  if (pathname.startsWith('/qaportfolioadmin')) {
    return null;
  }

  return (
    <div className="stars-container" aria-hidden="true">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
    </div>
  );
}
