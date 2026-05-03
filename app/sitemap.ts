import type { MetadataRoute } from 'next';
import { categories } from './lib/categories';

const BASE_URL = 'https://tehilimforall.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/categories`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/auth`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const psalmPages: MetadataRoute.Sitemap = Array.from({ length: 150 }, (_, i) => ({
    url: `${BASE_URL}/psalm/${i + 1}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...psalmPages, ...categoryPages];
}
