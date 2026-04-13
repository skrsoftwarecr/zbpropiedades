'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PropertyCard({ property }: { property: Property }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none shadow-md">
      <Link href={`/propiedades/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image 
          src={property.imageUrls[0] || 'https://picsum.photos/seed/prop/800/600'} 
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-primary/90 backdrop-blur-sm border-none">{property.type}</Badge>
        </div>
      </Link>
      <CardContent className="p-5">
        <div className="flex items-center gap-1 text-muted-foreground text-xs uppercase tracking-widest mb-2">
          <MapPin className="h-3 w-3" />
          {property.city}, {property.province}
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{property.title}</h3>
        <p className="text-2xl font-bold text-secondary mb-4">{formatPrice(property.price)}</p>
        
        <div className="flex justify-between border-t pt-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> {property.bedrooms} hab
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {property.bathrooms} baños
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" /> {property.area_m2} m²
          </div>
        </div>
      </CardContent>
    </Card>
  );
}