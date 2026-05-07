import type { Metadata } from 'next';
import type { Property } from '@/lib/types';
import { getCollection } from '@/lib/firestore-rest';
import PropertiesClient from './PropertiesClient';

function activeSaleProperties(items: Array<Property & { id: string }>) {
  return items.filter((p) => p.status !== 'Vendido' && (!p.operationType || p.operationType === 'Venta'));
}

export async function generateMetadata(): Promise<Metadata> {
  const properties = await getCollection<Property>('properties', 120);
  const active = activeSaleProperties(properties);

  return {
    robots: {
      index: active.length > 0,
      follow: true,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Propiedades en venta en Costa Rica',
      description: 'Explore casas, apartamentos, quintas, locales comerciales y oficinas en venta en Costa Rica con ZB Propiedades.',
      images: ['https://www.zbpropiedades.com/og-image.png'],
    },
  };
}

export default async function PropertiesPage() {
  const properties = await getCollection<Property>('properties', 120);
  const initialProperties = activeSaleProperties(properties);
  return <PropertiesClient initialProperties={initialProperties} />;
}
