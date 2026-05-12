
import type { Metadata } from 'next';
import Script from 'next/script';
import { getDocument } from '@/lib/firestore-rest';
import type { Lot } from '@/lib/types';
import LotDetailClient from './LotDetailClient';
import { formatCurrency } from '@/lib/currency';

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
    `${lot.lotType || 'Lote'} de ${lot.area_m2} m² en ${lot.city}, ${lot.province}. Precio: ${formatCurrency(lot.price, lot.currency)}.`;
  const canonicalUrl = `/lotes/${id}`;
  const image = lot.imageUrls?.[0] || 'https://zbpropiedades.com/og-image.png';

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
          alt: lot.title,
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

export default async function LotDetailPage({ params }: Props) {
  const { id } = await params;
  const lot = await getDocument<Lot>('lots', id);
  const priceCurrency = lot?.currency === 'USD' ? 'USD' : 'CRC';
  const lotUrl = `https://zbpropiedades.com/lotes/${id}`;

  const listingSchema = lot
    ? {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: lot.title,
        description: lot.description,
        url: lotUrl,
        image: lot.imageUrls?.length ? lot.imageUrls : ['https://zbpropiedades.com/og-image.png'],
        datePosted: new Date().toISOString(),
        address: {
          '@type': 'PostalAddress',
          addressLocality: lot.city,
          addressRegion: lot.province,
          addressCountry: 'CR',
        },
        offers: {
          '@type': 'Offer',
          price: lot.price,
          priceCurrency,
          availability: 'https://schema.org/InStock',
          url: lotUrl,
        },
        floorSize: {
          '@type': 'QuantitativeValue',
          value: lot.area_m2,
          unitCode: 'MTK',
        },
        additionalProperty: lot.topography
          ? [
              {
                '@type': 'PropertyValue',
                name: 'Topografía',
                value: lot.topography,
              },
            ]
          : undefined,
      }
    : null;

  return (
    <>
      {listingSchema && (
        <Script
          id={`lot-listing-schema-${id}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
        />
      )}
      <LotDetailClient id={id} />
    </>
  );
}
