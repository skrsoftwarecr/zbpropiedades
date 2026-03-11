'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function CartView() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.13; // 13% IVA Costa Rica
  const total = subtotal + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-xl font-semibold">Tu carrito está vacío</h2>
        <p className="mt-2 text-muted-foreground">Parece que aún no has agregado nada a tu carrito.</p>
        <Button asChild className="mt-6">
          <Link href="/parts">Comprar Repuestos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-2 space-y-4">
        {cart.map(item => {
          const itemImage = PlaceHolderImages.find(p => p.id === item.imageId);
          return (
            <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                {itemImage && (
                  <Image src={itemImage.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={itemImage.imageHint} />
                )}
              </div>
              <div className="flex-grow">
                <Link href={`/parts/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{formatPrice(item.price)} cada uno</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="mt-2 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="lg:col-span-1 sticky top-24">
        <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Resumen de la Orden</h2>
            <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
                <span>Impuestos (13%)</span>
                <span>{formatPrice(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
            </div>
            <Button asChild size="lg" className="w-full font-semibold">
                <Link href="/checkout">Proceder al Pago</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
