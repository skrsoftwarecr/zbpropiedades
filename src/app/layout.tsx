import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { KonamiListener } from '@/components/admin/konami-listener';

const siteConfig = {
  name: 'Bimmer CR',
  description: 'Su especialista en repuestos y vehículos BMW en Costa Rica. Encuentre partes originales, aftermarket y de alto rendimiento. Taller de servicio y venta de autos usados certificados.',
  url: 'https://www.bimmercr.com',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Repuestos y Vehículos BMW en Costa Rica`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Repuestos BMW Costa Rica', 'BMW Costa Rica', 'Repuestos alemanes', 'Bimmer CR', 'partes para BMW', 'taller BMW Costa Rica', 'vehículos BMW usados', 'M Performance', 'aftermarket', 'E36', 'E46', 'carros alemanes Costa Rica', 'servicio BMW'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `Logo de ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.jpg`],
    creator: '@BimmerCR', // Placeholder Twitter handle
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoPartsStore",
              "name": "Bimmer CR",
              "url": siteConfig.url,
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CR",
                "addressLocality": "San José",
                "postalCode": "10101",
                "streetAddress": "San José, Costa Rica"
              },
              "telephone": "+506-8888-8888", // Placeholder
              "priceRange": "$$",
              "makesOffered": "BMW",
              "openingHours": "Mo-Fr 08:00-17:00",
              "description": siteConfig.description,
            })
          }}
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <FirebaseClientProvider>
          <CartProvider>
            <KonamiListener />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
