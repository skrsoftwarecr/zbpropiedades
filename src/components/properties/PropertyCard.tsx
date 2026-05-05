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

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    if (!mounted) return '...';
    return formatCurrency(price, property.currency);
  };

  const operationText = property.operationType ? property.operationType.toUpperCase() : 'PROPIEDAD';
  const typeText = property.type ? property.type.toUpperCase() : 'INMUEBLE';

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none shadow-md flex flex-col h-full bg-white">
      <Link href={`/propiedades/${property.id}`} className="block relative aspect-[16/10] overflow-hidden">
        <Image 
          src={property.imageUrls[0] || 'https://picsum.photos/seed/prop/800/600'} 
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge className="bg-primary/90 backdrop-blur-md border-none px-3 py-1 uppercase tracking-wider text-[10px]">
            {typeText}
          </Badge>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-none px-3 py-1 uppercase tracking-wider text-[10px] font-bold shadow-sm">
            {operationText}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
           <div className="bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded text-xs inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.city}, {property.province}
           </div>
        </div>
      </Link>
      
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 font-headline">
          {property.title}
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
