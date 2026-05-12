import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propiedades en venta en Costa Rica',
  description: 'Explore casas, apartamentos, quintas, locales comerciales y oficinas en venta en Costa Rica con ZB Propiedades.',
  keywords: [
    'propiedades en venta Costa Rica',
    'casas en venta Costa Rica',
    'apartamentos en venta Costa Rica',
    'inmobiliaria Costa Rica',
  ],
  alternates: {
    canonical: '/propiedades',
  },
  openGraph: {
    title: 'Propiedades en venta en Costa Rica',
    description: 'Explore casas, apartamentos, quintas, locales comerciales y oficinas en venta en Costa Rica con ZB Propiedades.',
    url: '/propiedades',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Propiedades en venta en Costa Rica',
    description: 'Explore casas, apartamentos, quintas, locales comerciales y oficinas en venta en Costa Rica con ZB Propiedades.',
    images: ['https://zbpropiedades.com/og-image.png'],
  },
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
