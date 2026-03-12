'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent link navigation
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  
  const originalPrice = product.price;
  const discount = product.discountPercentage || 0;
  const discountedPrice = originalPrice - (originalPrice * discount / 100);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:shadow-primary/10 group">
      <CardHeader className="p-0">
        <Carousel 
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.play}
            onMouseLeave={plugin.current.stop}
        >
          <Link href={`/parts/${product.id}`} className="block aspect-square relative">
            <CarouselContent>
              {product.imageUrls.length > 0 ? product.imageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </CarouselItem>
              )) : (
                 <CarouselItem>
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                  </div>
                 </CarouselItem>
              )}
            </CarouselContent>
            {discount > 0 && (
                <Badge variant="destructive" className="absolute top-2 right-2 text-base">-{discount}%</Badge>
            )}
          </Link>
        </Carousel>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-base font-medium mb-1">
          <Link href={`/parts/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex flex-col">
            {discount > 0 && (
                <p className="text-sm font-normal text-muted-foreground line-through">{formatPrice(originalPrice)}</p>
            )}
            <p className="text-lg font-bold">{formatPrice(discountedPrice)}</p>
        </div>
        <Button
          size="icon"
          onClick={handleAddToCart}
          className={cn(
            'transition-all',
            isAdded && 'bg-green-500 hover:bg-green-600'
          )}
          aria-label={isAdded ? "Agregado al carrito" : "Agregar al carrito"}
        >
          {isAdded ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
