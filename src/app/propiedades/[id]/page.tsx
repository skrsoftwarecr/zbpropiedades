
import type { Metadata } from 'next';
import { getDocument } from '@/lib/firestore-rest';
import type { Property } from '@/lib/types';
import PropertyDetailClient from './PropertyDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getDocument<Property>('properties', id);

  if (!property) {
    return { title: 'Propiedad no encontrada | ZB Propiedades' };
  }

  const operacion = property.operationType === 'Alquiler' ? 'en Alquiler' : 'en Venta';
  const title = `${property.title} ${operacion} en ${property.city}, ${property.province} | ZB Propiedades`;
  const description =
    property.description?.slice(0, 160) ||
    `${property.type} de ${property.area_m2} m², ${property.bedrooms} hab., ${property.bathrooms} baños en ${property.city}, ${property.province}. Precio: $${property.price?.toLocaleString('es-CR')}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { title, description },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  return <PropertyDetailClient id={id} />;
}
