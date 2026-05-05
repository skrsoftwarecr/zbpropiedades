
import type { Metadata } from 'next';
import { getDocument } from '@/lib/firestore-rest';
import type { Lot } from '@/lib/types';
import LotDetailClient from './LotDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lot = await getDocument<Lot>('lots', id);

  if (!lot) {
    return { title: 'Lote no encontrado | ZB Propiedades' };
  }

  const title = `${lot.title} en ${lot.city}, ${lot.province} | ZB Propiedades`;
  const description =
    lot.description?.slice(0, 160) ||
    `${lot.lotType || 'Lote'} de ${lot.area_m2} m² en ${lot.city}, ${lot.province}. Precio: $${lot.price?.toLocaleString('es-CR')}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { title, description },
  };
}

export default async function LotDetailPage({ params }: Props) {
  const { id } = await params;
  return <LotDetailClient id={id} />;
}
