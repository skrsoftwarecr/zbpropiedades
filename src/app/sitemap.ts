import { MetadataRoute } from 'next'
import { getProducts, getVehicles } from '@/lib/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://example.com'; // Placeholder URL

  const staticRoutes = [
    '',
    '/parts',
    '/vehicles',
    '/taller',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const products = await getProducts();
  const productRoutes = products.map(product => ({
    url: `${siteUrl}/parts/${product.id}`,
    lastModified: new Date().toISOString(),
  }));

  const vehicles = await getVehicles();
  const vehicleRoutes = vehicles.map(vehicle => ({
    url: `${siteUrl}/vehicles/${vehicle.id}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...vehicleRoutes,
  ];
}
