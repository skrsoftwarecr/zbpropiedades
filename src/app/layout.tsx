import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { KonamiListener } from '@/components/admin/konami-listener';

const siteConfig = {
  name: 'ZB Propiedades',
  description: 'Venta de propiedades, lotes, quintas y alquileres en Costa Rica. En ZB Propiedades le ayudamos a comprar, vender o publicar su inmueble con asesoría profesional.',
  url: 'https://zbpropiedades.com',
  ogImage: 'https://zbpropiedades.com/og-image.png',
  phone: '+50664520745',
  email: 'Info@zbpropiedades.com',
  addressLocality: 'Guacima Arriba',
  addressRegion: 'Alajuela',
  openingHours: 'Mo-Su 07:00-20:00',
  yearsExperience: '10 años de experiencia en ventas',
  googleAnalyticsId: 'G-RCL9VW0YM0',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Propiedades, lotes y alquileres en Costa Rica`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'bienes raíces Costa Rica',
    'propiedades en venta Costa Rica',
    'lotes en venta Costa Rica',
    'venta de casas Costa Rica',
    'alquiler de propiedades Costa Rica',
    'vender propiedad Costa Rica',
    'vender lote Costa Rica',
    'inmobiliaria Costa Rica',
    'ZB Propiedades',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Propiedades, lotes y alquileres en Costa Rica`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Bienes raíces en Costa Rica`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Propiedades, lotes y alquileres en Costa Rica`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'real estate',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: 'es-CR',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/propiedades?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'RealEstateAgent',
      name: siteConfig.name,
      url: siteConfig.url,
      image: siteConfig.ogImage,
      logo: `${siteConfig.url}/icon.svg`,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      areaServed: 'Costa Rica',
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.addressLocality,
        addressRegion: siteConfig.addressRegion,
        addressCountry: 'CR',
      },
      sameAs: [
        'https://www.facebook.com/share/18icCQG8gX/?mibextid=wwXIfr',
        'https://www.instagram.com/marketingzb?igsh=bWV1ODE2YXV0Z3Zi',
        'https://wa.me/50664520745',
      ],
      knowsAbout: [
        'venta de propiedades',
        'lotes en venta',
        'quintas',
        'alquileres',
        'venta de inmuebles en Costa Rica',
        siteConfig.yearsExperience,
      ],
    },
    {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.svg`,
      image: siteConfig.ogImage,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: siteConfig.phone,
          email: siteConfig.email,
          contactType: 'customer support',
          availableLanguage: ['es', 'en'],
          areaServed: 'CR',
        },
      ],
      sameAs: [
        'https://www.facebook.com/share/18icCQG8gX/?mibextid=wwXIfr',
        'https://www.instagram.com/marketingzb?igsh=bWV1ODE2YXV0Z3Zi',
        'https://wa.me/50664520745',
      ],
    },
    {
      '@type': 'LocalBusiness',
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      image: siteConfig.ogImage,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.addressLocality,
        addressRegion: siteConfig.addressRegion,
        addressCountry: 'CR',
      },
      openingHours: siteConfig.openingHours,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '07:00',
          closes: '20:00',
        },
      ],
      areaServed: {
        '@type': 'Country',
        name: 'Costa Rica',
      },
      priceRange: '$$',
      sameAs: [
        'https://www.facebook.com/share/18icCQG8gX/?mibextid=wwXIfr',
        'https://www.instagram.com/marketingzb?igsh=bWV1ODE2YXV0Z3Zi',
        'https://wa.me/50664520745',
      ],
    },
  ],
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
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.googleAnalyticsId}');
            `}
          </Script>
          <Script
            id="structured-data"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <KonamiListener />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
        <Script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}

