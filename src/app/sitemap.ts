
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.zbpropiedades.com';

  const staticRoutes = [
    { route: '', priority: 1, changeFrequency: 'weekly' as const },
    { route: '/propiedades', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/lotes', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/alquileres', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/vendemos-su-propiedad', priority: 0.9, changeFrequency: 'weekly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    priority,
    changeFrequency,
  }));

  // Nota: Las rutas dinámicas de propiedades/lotes se indexan automáticamente si están enlazadas.
  // Para una implementación de producción, se recomienda realizar un fetch de IDs de Firestore aquí.
  
  return [
    ...staticRoutes,
  ];
}
