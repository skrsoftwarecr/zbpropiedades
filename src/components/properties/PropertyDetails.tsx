'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Bed, Bath, Square, CheckCircle2, MessageCircle, Share2, Camera } from 'lucide-react';
import type { Property } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PropertyDetailsProps {
  property: Property;
}

const WHATSAPP_NUMBER = "50660148363";

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const [mainImage, setMainImage] = useState(property.imageUrls[0]);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  };

  const handleWhatsAppContact = () => {
    const message = `¡Hola! Me interesa la propiedad: ${property.title} (${property.id}). Quisiera solicitar más información.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Mira esta propiedad en ZB Propiedades: ${property.title}`,
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Enlace copiado",
          description: "El enlace de la propiedad se ha copiado al portapapeles.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo copiar el enlace.",
        });
      }
    }
  };

  /**
   * getSafeMapUrl: Política de Cero Transformación para URLs de Propiedades.
   */
  const getSafeMapUrl = (input: string | undefined) => {
    if (!input) return null;
    
    let finalUrl = input.trim().replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/^['"]+|['"]$/g, "");

    // 1. Extraer src si es iframe
    if (finalUrl.includes('<iframe')) {
      const match = finalUrl.match(/src=["']([^"']+)["']/);
      if (match) finalUrl = match[1];
    }

    // 2. Si ya es un formato de inserción válido, usar directo
    if (finalUrl.includes('/embed/') || finalUrl.includes('output=embed') || finalUrl.includes('pb=')) {
        return finalUrl;
    }

    // 3. Fallback: Motor de búsqueda universal de Google
    return `https://maps.google.com/maps?q=${encodeURIComponent(finalUrl)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const embedUrl = getSafeMapUrl(property.mapUrl);
  const operationText = property.operationType ? property.operationType.toUpperCase() : 'PROPIEDAD';
  const typeText = property.type ? property.type.toUpperCase() : 'INMUEBLE';

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Galería de Imágenes */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border shadow-lg bg-muted">
            <Image 
              src={mainImage} 
              alt={property.title} 
              fill 
              className="object-cover transition-all duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
              <Camera className="h-3 w-3" />
              {property.imageUrls.length} fotos
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {property.imageUrls.map((url, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(url)}
                className={`relative flex-shrink-0 w-24 aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === url ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <Image 
                  src={url} 
                  alt={`${property.title} ${idx + 1}`} 
                  fill 
                  className="object-cover" 
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información Principal y Contacto */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-bold uppercase tracking-widest text-[10px] px-4 py-1.5">
                {typeText} {operationText}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" /> {property.province}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary leading-tight">
              {property.title}
            </h1>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-secondary" />
              <span className="text-lg">{property.city}, {property.province}, Costa Rica</span>
            </div>

            <p className="text-4xl font-bold text-secondary tracking-tight pt-4">
              {formatPrice(property.price)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-8 border-t border-b">
            <div className="text-center space-y-1">
              <Bed className="h-6 w-6 mx-auto text-primary/60" />
              <p className="text-sm text-muted-foreground">Habitaciones</p>
              <p className="font-bold text-lg">{property.bedrooms}</p>
            </div>
            <div className="text-center space-y-1">
              <Bath className="h-6 w-6 mx-auto text-primary/60" />
              <p className="text-sm text-muted-foreground">Baños</p>
              <p className="font-bold text-lg">{property.bathrooms}</p>
            </div>
            <div className="text-center space-y-1">
              <Square className="h-6 w-6 mx-auto text-primary/60" />
              <p className="text-sm text-muted-foreground">Área</p>
              <p className="font-bold text-lg">{property.area_m2} m²</p>
            </div>
          </div>

          <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-center">¿Interesado en esta propiedad?</h3>
              <p className="text-center text-primary-foreground/80 text-sm">
                Nuestro equipo de asesores expertos está listo para brindarle atención personalizada y agendar una visita.
              </p>
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-14 border-none"
                  onClick={handleWhatsAppContact}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contactar por WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full bg-transparent border-white/40 text-white hover:bg-white hover:text-primary h-14 transition-all font-bold"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Compartir Propiedad
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Descripción y Características */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline text-primary border-b pb-4">Descripción</h2>
            <div className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
              {property.description}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline text-primary border-b pb-4">Características y Amenidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mapa con Seguridad Blindada */}
        <div className="space-y-6">
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                Ubicación
              </h3>
              <div className="w-full aspect-square rounded-xl overflow-hidden border shadow-inner bg-muted relative z-10" style={{ minHeight: '300px' }}>
                {embedUrl ? (
                  <iframe
                    key={property.id}
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen
                    loading="eager"
                    referrerPolicy="no-referrer"
                    sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-center p-8">
                    <div className="flex flex-col items-center">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">Ubicación pendiente de actualizar.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
