'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ShoppingCart, Minus, Plus } from 'lucide-react';

import type { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const productImage = product.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/500/500';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    toast({
        title: "Agregado al carrito",
        description: `${quantity}x ${product.name}`,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };
  
  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, product.stock));
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="w-full">
        <div className="aspect-square relative w-full overflow-hidden rounded-lg border">
            <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover"
            />
        </div>
      </div>

      <div className="flex flex-col">
        <div className='flex items-center gap-2 mb-2'>
            <Badge variant={product.category === 'Original' ? 'default' : 'secondary'} className="w-fit">{product.category}</Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>
        
        <div className="flex items-baseline gap-4 my-4">
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-2">Especificaciones</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><strong>Condición:</strong> {product.condition}</li>
            <li><strong>En Stock:</strong> {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}</li>
            <li><strong>Compatibilidad:</strong> {product.compatibility.join(', ')}</li>
          </ul>
        </div>

        <div className="mt-auto pt-6">
            <div className="flex items-center gap-4 mb-4">
                <p className="font-medium">Cantidad:</p>
                <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10">
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                     <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Button 
              size="lg" 
              className="w-full font-semibold text-lg" 
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdded}
            >
              <div className={cn("transition-transform duration-300", isAdded ? 'rotate-0' : '-rotate-90')}>
                {isAdded ? <Check className="h-6 w-6 mr-2" /> : <ShoppingCart className="h-6 w-6 mr-2" />}
              </div>
              {product.stock === 0 ? 'Agotado' : isAdded ? '¡Agregado!' : 'Agregar al Carrito'}
            </Button>
        </div>
      </div>
    </div>
  );
}
