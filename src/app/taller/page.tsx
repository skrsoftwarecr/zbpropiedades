import Image from 'next/image';
import type { Metadata } from 'next';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Truck, ShieldCheck, PaintRoller, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Taller de Servicio BMW',
  description: 'Ofrecemos servicios especializados para su BMW en Costa Rica: mecánica a domicilio, mantenimiento preventivo, enderezado y pintura. Confíe en los expertos de Bimmer CR.',
};

const services = [
  {
    title: 'Mecánica a Domicilio',
    description: '¿No tiene tiempo de venir a nuestro taller? Nosotros vamos donde usted esté. Ofrecemos diagnóstico y reparaciones generales a domicilio para su conveniencia.',
    icon: Truck,
    imageId: 'servicio-mecanica',
  },
  {
    title: 'Mantenimiento Preventivo',
    description: 'Mantenga su BMW en óptimas condiciones. Realizamos todos los servicios de mantenimiento básico y preventivo según las especificaciones del fabricante.',
    icon: ShieldCheck,
    imageId: 'servicio-mantenimiento',
  },
  {
    title: 'Enderezado y Pintura',
    description: 'Devuélvale a su vehículo su gloria original. Contamos con un taller de alta tecnología para reparaciones de carrocería y acabados de pintura de fábrica.',
    icon: PaintRoller,
    imageId: 'servicio-pintura',
  },
];

const ServiceCard = ({ title, description, icon: Icon, imageId }: { title: string, description: string, icon: React.ElementType, imageId: string }) => {
  const image = PlaceHolderImages.find(p => p.id === imageId);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
        {image && (
            <div className="aspect-video relative w-full">
                <Image 
                    src={image.imageUrl} 
                    alt={title}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                />
            </div>
        )}
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};


export default function TallerPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'taller-hero');

  return (
    <div className="flex flex-col">
      <section className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center text-primary-foreground">
        {heroImage && (
            <Image 
                src={heroImage.imageUrl} 
                alt="Taller Bimmer CR"
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-md">Taller de Servicio Especializado</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/90 drop-shadow">
            Mantenimiento y reparación de expertos para su vehículo europeo.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Nuestros Servicios</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Soluciones integrales para mantener su BMW funcionando como el primer día.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Agende su Servicio</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    ¿Listo para darle a su vehículo el cuidado que merece? Contáctenos hoy mismo.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" asChild>
                        <a href="tel:+50688888888">
                            <Phone className="mr-2 h-5 w-5" /> Llamar Ahora
                        </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href="mailto:contacto@bimmercr.com">
                            <Mail className="mr-2 h-5 w-5" /> Enviar Correo
                        </a>
                    </Button>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}
