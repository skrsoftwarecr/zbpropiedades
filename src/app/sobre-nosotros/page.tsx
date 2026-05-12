import Script from 'next/script';
import { ShieldCheck, Users, Building2, BadgeCheck, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_URL = 'https://wa.me/50664520745';

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      name: 'Sobre Nosotros | ZB Propiedades',
      url: 'https://zbpropiedades.com/sobre-nosotros',
      about: {
        '@type': 'Organization',
        name: 'ZB Propiedades',
      },
    },
    {
      '@type': 'Organization',
      name: 'ZB Propiedades',
      url: 'https://zbpropiedades.com',
      logo: 'https://zbpropiedades.com/icon.svg',
      telephone: '+50664520745',
      email: 'Info@zbpropiedades.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Guacima Arriba',
        addressRegion: 'Alajuela',
        addressCountry: 'CR',
      },
      areaServed: 'Costa Rica',
      knowsAbout: ['Compra de propiedades', 'Venta de propiedades', 'Lotes y quintas', 'Alquileres'],
      sameAs: [
        'https://www.facebook.com/share/18icCQG8gX/?mibextid=wwXIfr',
        'https://www.instagram.com/marketingzb?igsh=bWV1ODE2YXV0Z3Zi',
        'https://wa.me/50664520745',
      ],
    },
    {
      '@type': 'LocalBusiness',
      name: 'ZB Propiedades',
      url: 'https://zbpropiedades.com',
      telephone: '+50664520745',
      email: 'Info@zbpropiedades.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Guacima Arriba',
        addressRegion: 'Alajuela',
        addressCountry: 'CR',
      },
      openingHours: 'Mo-Su 07:00-20:00',
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
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <Script
        id="about-page-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <section className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Sobre ZB Propiedades</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Somos una firma inmobiliaria enfocada en conectar familias e inversionistas con oportunidades reales en Costa Rica,
            mediante procesos transparentes, asesorÃ­a profesional y acompaÃ±amiento de inicio a cierre.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Base de operaciones: Alajuela, GuÃ¡cima Arriba. Horario de atenciÃ³n: 7:00 a.m. a 8:00 p.m.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="rounded-2xl border p-6 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold">Nuestra trayectoria</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Hemos acompaÃ±ado a clientes en procesos de compra, venta y alquiler de inmuebles en distintas provincias del paÃ­s,
              con enfoque en anÃ¡lisis de mercado, presentaciÃ³n comercial y negociaciÃ³n segura.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3 font-medium">
              Contamos con 10 aÃ±os de experiencia en ventas.
            </p>
          </div>

          <div className="rounded-2xl border p-6 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold">Compromiso y transparencia</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Priorizamos claridad documental, comunicaciÃ³n constante y validaciÃ³n de informaciÃ³n para que cada decisiÃ³n de alto
              impacto financiero se tome con respaldo profesional.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border p-6 md:p-8 bg-muted/20">
          <h2 className="text-2xl font-bold mb-6">SeÃ±ales de confianza</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-secondary mt-1" />
              <div>
                <p className="font-semibold">AtenciÃ³n personalizada</p>
                <p className="text-sm text-muted-foreground">Cada propiedad se trabaja con estrategia comercial y seguimiento directo.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-secondary mt-1" />
              <div>
                <p className="font-semibold">AcompaÃ±amiento integral</p>
                <p className="text-sm text-muted-foreground">Desde la publicaciÃ³n hasta la negociaciÃ³n y formalizaciÃ³n final.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-secondary mt-1" />
              <div>
                <p className="font-semibold">Canal directo</p>
                <p className="text-sm text-muted-foreground">AsesorÃ­a por WhatsApp y llamada al +506 6452-0745. Correo: Info@zbpropiedades.com.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-primary text-primary-foreground p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Â¿Desea vender o comprar con respaldo profesional?</h2>
          <p className="text-primary-foreground/85 max-w-2xl mx-auto">
            Nuestro equipo puede orientarle con una ruta clara para su prÃ³ximo paso inmobiliario.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> Hablar por WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

