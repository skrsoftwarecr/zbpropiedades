'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, ChevronRight } from 'lucide-react';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';

export function PropertyCard({ property }: { property: Property }) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (property.imageUrls.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % property.imageUrls.length);
        setFading(false);
      }, 350);
      import { useState, useEffect, useRef } from 'react';
    return () => clearInterval(interval);
  }, [property.imageUrls.length]);

  const formatPrice = (price: number) => {
        const [nextIndex, setNextIndex] = useState<number | null>(null);
        const [isTransitioning, setIsTransitioning] = useState(false);
        const currentIndexRef = useRef(0);
    return formatCurrency(price, property.currency);
  };

  const operationText = property.operationType ? property.operationType.toUpperCase() : 'PROPIEDAD';
  const typeText = property.type ? property.type.toUpperCase() : 'INMUEBLE';

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none shadow-md flex flex-col h-full bg-white">
      <Link href={`/propiedades/${property.id}`} className="block relative aspect-[16/10] overflow-hidden">
        <Image 
          src={property.imageUrls[currentIndex] || 'https://picsum.photos/seed/prop/800/600'} 
          let switchTimeout: ReturnType<typeof setTimeout> | null = null;
          alt={property.title}
          fill
            const upcoming = (currentIndexRef.current + 1) % property.imageUrls.length;
            setNextIndex(upcoming);
            setIsTransitioning(true);

            switchTimeout = setTimeout(() => {
              setCurrentIndex(upcoming);
              currentIndexRef.current = upcoming;
              setNextIndex(null);
              setIsTransitioning(false);
            }, 500);
          </Badge>

          return () => {
            clearInterval(interval);
            if (switchTimeout) clearTimeout(switchTimeout);
          };
            {operationText}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
        const currentImage = property.imageUrls[currentIndex] || 'https://picsum.photos/seed/prop/800/600';
        const upcomingImage = nextIndex !== null
          ? property.imageUrls[nextIndex] || 'https://picsum.photos/seed/prop/800/600'
          : null;
           <div className="bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded text-xs inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.city}, {property.province}
           </div>
              <Image
                src={currentImage}
      
      <CardContent className="p-6 flex-grow">
                className={`object-cover transition-[transform,opacity] duration-500 ease-in-out group-hover:scale-110 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          {property.title}
              {upcomingImage && (
                <Image
                  src={upcomingImage}
                  alt={property.title}
                  fill
                  className={`object-cover transition-[transform,opacity] duration-500 ease-in-out group-hover:scale-110 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
                />
              )}
        </h3>
        <p className="text-2xl font-bold text-secondary mb-4 tracking-tight">
          {formatPrice(property.price)}
        </p>
        
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-muted">
          <div className="flex flex-col items-center gap-1">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">{property.bedrooms} Hab</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">{property.bathrooms} Baños</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">{property.area_m2} m²</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full group/btn" asChild>
          <Link href={`/propiedades/${property.id}`} className="flex items-center justify-center">
            Ver Detalles 
            <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
