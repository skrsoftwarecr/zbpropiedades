'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Property, Lot } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Home, Landmark, Key, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              title="Residencias"
              description="Casas y apartamentos en preventa o listos para estrenar en las zonas de mayor plusvalía."
              href="/propiedades"
              image="https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800"
              icon={Home}
            />
            <ServiceCard 
              title="Lotes y Quintas"
              description="Terrenos ideales para construir su proyecto de vida o inversión agrícola/comercial."
              href="/lotes"
              image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
              icon={Landmark}
            />
            <ServiceCard 
              title="Venda con Nosotros"
              description="Le ayudamos a encontrar al comprador ideal con estrategias de marketing premium."
              href="https://wa.me/50660148363"
              image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
              icon={Key}
            />
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
