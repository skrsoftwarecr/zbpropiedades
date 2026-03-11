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
  const tax = subtotal * 0.07; // Example 7% tax
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/parts">Start Shopping</Link>
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
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
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
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
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
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
                <span>Taxes (7%)</span>
                <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <Button asChild size="lg" className="w-full font-semibold">
                <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
