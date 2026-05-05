
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Square, ChevronRight, Landmark } from 'lucide-react';
import type { Lot } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';

export function LotCard({ lot }: { lot: Lot }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    if (!mounted) return '...';
    return formatCurrency(price, lot.currency);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none shadow-md flex flex-col h-full bg-white">
      <Link href={`/lotes/${lot.id}`} className="block relative aspect-[16/10] overflow-hidden">
        <Image 
          src={lot.imageUrls[0] || 'https://picsum.photos/seed/lot/800/600'} 
          alt={lot.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-primary/90 backdrop-blur-md border-none px-3 py-1 uppercase tracking-wider text-[10px]">
            Lote / Terreno
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
           <div className="bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded text-xs inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {lot.city}, {lot.province}
           </div>
        </div>
      </Link>
      
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 font-headline">
          {lot.title}
        </h3>
        <p className="text-2xl font-bold text-secondary mb-4 tracking-tight">
          {formatPrice(lot.price)}
        </p>
        
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-muted">
          <div className="flex flex-col items-center gap-1 border-r">
            <Square className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">{lot.area_m2.toLocaleString()} m²</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold line-clamp-1">{lot.topography}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full group/btn" asChild>
          <Link href={`/lotes/${lot.id}`} className="flex items-center justify-center">
            Ver Detalles 
            <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
