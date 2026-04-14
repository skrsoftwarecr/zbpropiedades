import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { KonamiListener } from '@/components/admin/konami-listener';

const siteConfig = {
  name: 'ZB Propiedades',
  description: 'Su aliado experto en bienes raíces en Costa Rica. Casas, apartamentos y lotes de alta calidad.',
  url: 'https://www.zbpropiedades.com',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Bienes Raíces en Costa Rica`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Bienes Raíces Costa Rica', 'Venta de casas Costa Rica', 'Lotes en venta Costa Rica', 'ZB Propiedades', 'Inmobiliaria Costa Rica', 'Casas de lujo CR'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col selection:bg-secondary/30')}>
        <FirebaseClientProvider>
          <KonamiListener />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
