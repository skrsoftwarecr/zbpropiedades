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
  description: 'Encuentre repuestos originales y de posventa para su BMW en Costa Rica. Ofrecemos vehículos usados certificados y un servicio excepcional. Bimmer CR, su especialista en BMW.',
  url: 'https://example.com', // Placeholder URL
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Repuestos y Vehículos BMW en Costa Rica`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['BMW', 'repuestos', 'vehículos', 'Costa Rica', 'M Performance', 'aftermarket', 'original', 'taller', 'servicio'],
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
        url: 'https://picsum.photos/seed/ogimage/1200/630',
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
    images: ['https://picsum.photos/seed/ogimage/1200/630'],
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
