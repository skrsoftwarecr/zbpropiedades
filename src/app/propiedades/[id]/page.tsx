
import type { Metadata } from 'next';
import Script from 'next/script';
import { getDocument } from '@/lib/firestore-rest';
import type { Property } from '@/lib/types';
import PropertyDetailClient from './PropertyDetailClient';
import { formatCurrency } from '@/lib/currency';

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
    `${property.type} de ${property.area_m2} m², ${property.bedrooms} hab., ${property.bathrooms} baños en ${property.city}, ${property.province}. Precio: ${formatCurrency(property.price, property.currency)}.`;
  const canonicalUrl = `/propiedades/${id}`;
  const image = property.imageUrls?.[0] || 'https://www.zbpropiedades.com/og-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getDocument<Property>('properties', id);
  const priceCurrency = property?.currency === 'USD' ? 'USD' : 'CRC';
  const propertyUrl = `https://www.zbpropiedades.com/propiedades/${id}`;

  const listingSchema = property
    ? {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        description: property.description,
        url: propertyUrl,
        image: property.imageUrls?.length ? property.imageUrls : ['https://www.zbpropiedades.com/og-image.png'],
        datePosted: new Date().toISOString(),
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.city,
          addressRegion: property.province,
          addressCountry: 'CR',
        },
        offers: {
          '@type': 'Offer',
          price: property.price,
          priceCurrency,
          availability: property.status === 'Vendido' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          url: propertyUrl,
        },
        floorSize: {
          '@type': 'QuantitativeValue',
          value: property.area_m2,
          unitCode: 'MTK',
        },
        numberOfRooms: property.bedrooms,
        numberOfBathroomsTotal: property.bathrooms,
      }
    : null;

  return (
    <>
      {listingSchema && (
        <Script
          id={`property-listing-schema-${id}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
        />
      )}
      <PropertyDetailClient id={id} />
    </>
  );
}
