import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propiedades en alquiler en Costa Rica',
  description: 'Revise propiedades residenciales y comerciales en alquiler en Costa Rica, con opciones en distintas provincias y presupuestos.',
  keywords: [
    'alquiler de propiedades Costa Rica',
    'casas en alquiler Costa Rica',
    'apartamentos en alquiler Costa Rica',
    'locales comerciales en alquiler Costa Rica',
  ],
  alternates: {
    canonical: '/alquileres',
  },
  openGraph: {
    title: 'Propiedades en alquiler en Costa Rica',
    description: 'Revise propiedades residenciales y comerciales en alquiler en Costa Rica, con opciones en distintas provincias y presupuestos.',
    url: '/alquileres',
  },
};

export default function RentalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}