
import { MetadataRoute } from 'next'
import { getCollection } from '@/lib/firestore-rest';
import type { Property, Lot } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://zbpropiedades.com';

  const staticRoutes = [
    { route: '', priority: 1, changeFrequency: 'weekly' as const },
    { route: '/propiedades', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/lotes', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/alquileres', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/vendemos-su-propiedad', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/sobre-nosotros', priority: 0.8, changeFrequency: 'monthly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    priority,
    changeFrequency,
  }));

  const [properties, lots] = await Promise.all([
    getCollection<Property>('properties', 200),
    getCollection<Lot>('lots', 200),
  ]);

  const propertyRoutes = properties
    .filter((property) => property.status !== 'Vendido')
    .map((property) => ({
      url: `${siteUrl}/propiedades/${property.id}`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    }));

  const lotRoutes = lots.map((lot) => ({
    url: `${siteUrl}/lotes/${lot.id}`,
    lastModified: new Date().toISOString(),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...lotRoutes,
  ];
}

