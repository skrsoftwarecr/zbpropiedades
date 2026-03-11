import { CartView } from '@/components/cart/CartView';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Shopping Cart</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Review your items and proceed to checkout.
        </p>
      </div>
      <CartView />
    </div>
  );
}
