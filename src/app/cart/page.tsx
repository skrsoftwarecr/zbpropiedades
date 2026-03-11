import { CartView } from '@/components/cart/CartView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito de Compras',
  description: 'Revise los artículos en su carrito de compras y proceda al pago. Bimmer CR.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Carrito de Compras</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Revise sus artículos y proceda al pago.
        </p>
      </div>
      <CartView />
    </div>
  );
}
