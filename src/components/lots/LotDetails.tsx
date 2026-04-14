
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Square, CheckCircle2, MessageCircle, Share2, Camera, Landmark } from 'lucide-react';
import type { Lot } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LotDetailsProps {
  lot: Lot;
}

export function LotDetails({ lot }: LotDetailsProps) {
  const [mainImage, setMainImage] = useState(lot.imageUrls[0]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  };

  const handleWhatsAppContact = () => {
    const message = `¡Hola! Me interesa el lote: ${lot.title} (${lot.id}). Quisiera solicitar más información.`;
    window.open(`https://wa.me/50688888888?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lot.title,
          text: `Mira este lote en ZB Propiedades: ${lot.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const hasMap = lot.mapUrl && lot.mapUrl.startsWith('https://');

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Galería de Imágenes */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border shadow-lg bg-muted">
            <Image 
              src={mainImage} 
              alt={lot.title} 
              fill 
              className="object-cover transition-all duration-500"
              priority
            />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
              <Camera className="h-3 w-3" />
              {lot.imageUrls.length} fotos
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {lot.imageUrls.map((url, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(url)}
                className={`relative flex-shrink-0 w-24 aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === url ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <Image src={url} alt={`${lot.title} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Información Principal y Contacto */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 font-bold uppercase tracking-widest text-[10px]">
                Lote en Venta
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" /> {lot.province}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary leading-tight">
              {lot.title}
            </h1>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-secondary" />
              <span className="text-lg">{lot.city}, {lot.province}, Costa Rica</span>
            </div>

            <p className="text-4xl font-bold text-secondary tracking-tight pt-4">
              {formatPrice(lot.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 border-t border-b">
            <div className="text-center space-y-1 border-r">
              <Square className="h-6 w-6 mx-auto text-primary/60" />
              <p className="text-sm text-muted-foreground">Área Total</p>
              <p className="font-bold text-lg">{lot.area_m2.toLocaleString()} m²</p>
            </div>
            <div className="text-center space-y-1">
              <Landmark className="h-6 w-6 mx-auto text-primary/60" />
              <p className="text-sm text-muted-foreground">Topografía</p>
              <p className="font-bold text-lg">{lot.topography}</p>
            </div>
          </div>

          <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-center">¿Desea conocer este terreno?</h3>
              <p className="text-center text-primary-foreground/80 text-sm">
                Agende una visita hoy mismo con nuestros asesores para conocer el potencial de esta inversión.
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
                  Compartir Lote
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
            <h2 className="text-3xl font-bold font-headline text-primary border-b pb-4">Descripción del Terreno</h2>
            <div className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
              {lot.description}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline text-primary border-b pb-4">Servicios y Ventajas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lot.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                Ubicación del Lote
              </h3>
              {hasMap ? (
                <div className="aspect-square rounded-xl overflow-hidden border shadow-inner bg-muted">
                  <iframe
                    src={lot.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-square bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-center p-8 border border-dashed border-muted-foreground/30">
                  <div>
                    <Landmark className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Ubicación exacta disponible bajo consulta.<br/><strong>Zona: {lot.city}</strong></p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
