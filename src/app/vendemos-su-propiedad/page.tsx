'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageCircle, DollarSign, Camera, Users, ShieldCheck } from 'lucide-react';

const WHATSAPP_NUMBER = "50660148363";

export default function SellWithUsPage() {
  const handleWhatsAppContact = () => {
    const message = "Hola ZB Propiedades. Quisiera más información sobre el servicio de gestión de venta/alquiler para mi propiedad.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const features = [
    {
      title: "Publicidad 100% Gratuita",
      description: "Nosotros asumimos el riesgo publicitario. Promocionamos su propiedad en las mejores plataformas sin costo alguno para usted.",
      icon: DollarSign
    },
    {
      title: "Gestión Profesional",
      description: "Atendemos llamadas, filtramos clientes potenciales y agendamos visitas, ahorrándole tiempo y preocupaciones.",
      icon: Users
    },
    {
      title: "Material Visual de Calidad",
      description: "Resaltamos los mejores ángulos de su propiedad para atraer a los compradores adecuados.",
      icon: Camera
    },
    {
      title: "Pago Solo al Finalizar",
      description: "Usted no paga nada por adelantado. Nuestra comisión se hace efectiva únicamente cuando la venta o el alquiler se concreta exitosamente.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 leading-tight">
              Vendemos su propiedad <br/>
              <span className="text-secondary">sin costos iniciales</span>
            </h1>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              En ZB Propiedades, somos sus aliados expertos. Nos encargamos de todo el proceso de mercadeo y venta, permitiéndole disfrutar de un proceso libre de estrés.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-14 px-10 text-lg font-bold"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="mr-2 h-6 w-6" /> Solicitar Asesoría Gratuita
            </Button>
          </div>
        </div>
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
           <ShieldCheck className="w-full h-full text-white" />
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Un modelo basado en resultados</h2>
            <p className="text-muted-foreground text-lg">
              Usted solo paga cuando nosotros cumplimos nuestro objetivo: vender o alquilar su propiedad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-6 p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-4 rounded-xl h-fit">
                  <feature.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Space for Future Expansion */}
      <section className="py-16 bg-muted/20 border-y border-dashed">
        <div className="container px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Próximamente: Guía del Vendedor</h3>
          <p className="text-muted-foreground max-w-xl mx-auto italic">
            Estamos preparando contenido exclusivo para ayudarle a preparar su propiedad para el mercado y maximizar su valor de cierre.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20">
        <div className="container px-4">
          <div className="bg-primary rounded-[2rem] p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-headline">¿Hablamos de su propiedad?</h2>
              <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">
                No pierda más tiempo gestionando llamadas de curiosos. Deje que el equipo de ZB Propiedades se encargue de todo de forma profesional.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-8"
                  onClick={handleWhatsAppContact}
                >
                  Agendar Cita por WhatsApp
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white/20 text-white hover:bg-white hover:text-primary h-14 px-8"
                  asChild
                >
                  <a href="tel:+50660148363">Llamar Directamente</a>
                </Button>
              </div>
            </div>
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
