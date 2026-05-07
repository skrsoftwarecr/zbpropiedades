import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZB Propiedades',
    short_name: 'ZB Propiedades',
    description: 'Venta de propiedades, lotes, quintas y alquileres en Costa Rica.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a3a5c',
    theme_color: '#1a3a5c',
    lang: 'es-CR',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
