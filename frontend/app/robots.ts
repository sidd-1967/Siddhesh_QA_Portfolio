import { MetadataRoute } from 'next';
import { AppConfig } from '@/config/app.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/qaportfolioadmin/', '/qaportfolioadmin/*'],
    },
    sitemap: `${AppConfig.app.url}/sitemap.xml`,
  };
}
