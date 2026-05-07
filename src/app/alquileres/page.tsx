import type { Metadata } from 'next';
import type { Property } from '@/lib/types';
import { getCollection } from '@/lib/firestore-rest';
import RentalsClient from './RentalsClient';

function activeRentals(items: Array<Property & { id: string }>) {
  return items.filter((p) => p.status !== 'Vendido' && p.operationType === 'Alquiler');
}

export async function generateMetadata(): Promise<Metadata> {
  const properties = await getCollection<Property>('properties', 120);
  const rentals = activeRentals(properties);

  return {
    robots: {
      index: rentals.length > 0,
      follow: true,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Propiedades en alquiler en Costa Rica',
      description: 'Revise propiedades residenciales y comerciales en alquiler en Costa Rica, con opciones en distintas provincias y presupuestos.',
      images: ['https://www.zbpropiedades.com/og-image.png'],
    },
  };
}

export default async function RentalsPage() {
  const properties = await getCollection<Property>('properties', 120);
  const initialRentals = activeRentals(properties);
  return <RentalsClient initialRentals={initialRentals} />;
}
