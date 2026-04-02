import type { MetadataRoute } from 'next'

import { categoryPages, toolsCatalog } from '@/lib/toolsCatalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.zenovee.in'

  const staticRoutes = [
    '',
    '/tools',
    '/pricing',
    '/documentation',
    '/extension',
    '/install',
    '/privacy',
    '/login',
    '/register',
    '/dashboard',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const categoryRoutes = categoryPages.map((category) => ({
    url: `${base}/tools/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const toolRoutes = toolsCatalog.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes]
}