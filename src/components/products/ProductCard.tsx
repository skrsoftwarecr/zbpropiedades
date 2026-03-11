'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const productImage = PlaceHolderImages.find(p => p.id === product.imageId);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="p-0">
        <Link href={`/parts/${product.id}`} className="block aspect-square relative">
          {productImage && (
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={productImage.imageHint}
            />
          )}
        </Link>
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
        <p className="text-lg font-bold">{formatPrice(product.price)}</p>
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
