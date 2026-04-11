import type { Metadata } from 'next';
// Font optimization removed to prevent Google Fonts API fetch timeout errors during build.
// Fonts are loaded via standard link tags below instead.
import './globals.css';
import { AppConfig } from '@/config/app.config';

export async function generateMetadata(): Promise<Metadata> {
  let name: string = AppConfig.app.name;
  try {
    const res = await fetch(`${AppConfig.apiBaseUrl}/api/profile`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.fullName) {
        name = `${data.data.fullName} | QA Engineer`;
      }
    }
  } catch (err) {
    console.error('Metadata fetch failed:', err);
  }

  return {
    title: name,
    description: AppConfig.app.description,
    authors: [{ name: AppConfig.app.author }],
    keywords: [
      'QA Engineer', 'Test Automation', 'Selenium', 'Cypress', 'Playwright',
      'Software Testing', 'ISTQB', 'API Testing', 'Portfolio'
    ],
    openGraph: {
      title: name,
      description: AppConfig.app.description,
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
