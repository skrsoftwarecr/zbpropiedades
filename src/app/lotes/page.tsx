import type { Metadata } from 'next';
import type { Lot } from '@/lib/types';
import { getCollection } from '@/lib/firestore-rest';
import LotsClient from './LotsClient';

export async function generateMetadata(): Promise<Metadata> {
  const lots = await getCollection<Lot>('lots', 120);

  return {
    robots: {
      index: lots.length > 0,
      follow: true,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lotes y terrenos en venta en Costa Rica',
      description: 'Encuentre lotes, terrenos y quintas en venta en Costa Rica para construir, invertir o desarrollar su próximo proyecto.',
      images: ['https://www.zbpropiedades.com/og-image.png'],
    },
  };
}

export default async function LotsPage() {
  const initialLots = await getCollection<Lot>('lots', 120);
  return <LotsClient initialLots={initialLots} />;
}
