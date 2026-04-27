'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Landmark, Key, Phone, ArrowRight, Tag } from 'lucide-react';

const WHATSAPP_URL = "https://wa.me/50660148363";

const ServiceCard = ({ title, description, href, image, icon: Icon }: any) => (
  <Link href={href} className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-2xl">
    <div className="aspect-[16/10] relative overflow-hidden">
      <Image 
        src={image} 
        alt={title} 
        fill 
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
      <div className="absolute top-4 left-4 bg-primary text-primary-foreground p-2 rounded-lg">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </Link>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center">
        <Image 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600"
          alt="Lujosa propiedad en Costa Rica"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="container relative z-10 px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-in fade-in slide-in-from-left-8 duration-1000">
              Encuentre el hogar <br/> 
              <span className="text-secondary">de sus sueños</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 font-light">
              Propiedades exclusivas y lotes premium en las mejores zonas de Costa Rica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 h-14 bg-secondary hover:bg-secondary/90 text-white border-none" asChild>
                <Link href="/propiedades">Ver Propiedades</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20" asChild>
                <Link href="/lotes">Explorar Lotes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Qué está buscando hoy?</h2>
            <p className="text-muted-foreground text-lg">
              Ofrecemos soluciones inmobiliarias integrales adaptadas a sus necesidades y presupuesto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ServiceCard 
              title="Residencias"
              description="Casas y apartamentos listos para estrenar en las zonas de mayor plusvalía."
              href="/propiedades"
              image="https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800"
              icon={Home}
            />
            <ServiceCard 
              title="Lotes y Quintas"
              description="Terrenos ideales para construir su proyecto de vida o inversión agrícola."
              href="/lotes"
              image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
              icon={Landmark}
            />
            <ServiceCard 
              title="Alquileres"
              description="Opciones residenciales y comerciales con las mejores ubicaciones y precios."
              href="/alquileres"
              image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"
              icon={Key}
            />
          </div>

          <div className="mt-16 max-w-4xl mx-auto bg-muted/30 rounded-2xl p-8 border border-dashed flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="bg-secondary/10 text-secondary p-3 rounded-full w-fit">
                <Tag className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">¿Desea vender o alquilar su propiedad?</h3>
              <p className="text-muted-foreground">
                Nos encargamos de toda la gestión, desde la publicidad profesional hasta el cierre final. ¡Sin costos iniciales!
              </p>
              <Button asChild variant="link" className="p-0 h-auto font-bold text-primary group">
                <Link href="/vendemos-su-propiedad" className="flex items-center gap-2">
                  Conocer más del servicio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="relative w-full md:w-64 aspect-square rounded-xl overflow-hidden shadow-lg">
               <Image 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600"
                alt="Servicio inmobiliario"
                fill
                className="object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Atención personalizada y experta</h2>
          <p className="text-xl mb-10 opacity-80 max-w-2xl mx-auto">
            Nuestro equipo de asesores está listo para guiarle en cada paso del proceso de compra o venta.
          </p>
          <Button size="lg" variant="secondary" className="font-bold h-14 px-10" asChild>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Phone className="mr-2 h-5 w-5" /> Contactar Asesor
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
