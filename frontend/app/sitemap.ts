import { MetadataRoute } from 'next';
import { AppConfig } from '@/config/app.config';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: AppConfig.app.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
