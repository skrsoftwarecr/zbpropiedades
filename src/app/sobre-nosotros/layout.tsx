import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | ZB Propiedades',
  description: 'Conozca al equipo de ZB Propiedades, nuestra trayectoria en bienes raíces en Costa Rica y nuestro compromiso de atención profesional y transparente.',
  alternates: {
    canonical: '/sobre-nosotros',
  },
  openGraph: {
    title: 'Sobre Nosotros | ZB Propiedades',
    description: 'Conozca al equipo de ZB Propiedades, nuestra trayectoria en bienes raíces en Costa Rica y nuestro compromiso de atención profesional y transparente.',
    url: '/sobre-nosotros',
    images: ['https://zbpropiedades.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nosotros | ZB Propiedades',
    description: 'Conozca al equipo de ZB Propiedades, nuestra trayectoria en bienes raíces en Costa Rica y nuestro compromiso de atención profesional y transparente.',
    images: ['https://zbpropiedades.com/og-image.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

