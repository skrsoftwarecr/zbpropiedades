
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.zbpropiedades.com';

  const staticRoutes = [
    '',
    '/propiedades',
    '/lotes',
    '/alquileres',
    '/vendemos-su-propiedad',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Nota: Las rutas dinámicas de propiedades/lotes se indexan automáticamente si están enlazadas.
  // Para una implementación de producción, se recomienda realizar un fetch de IDs de Firestore aquí.
  
  return [
    ...staticRoutes,
  ];
}
