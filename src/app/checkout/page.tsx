import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Finalizar Compra',
    description: 'Complete su información de pago y envío para finalizar su orden en Bimmer CR.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Finalizar Compra</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Complete su pedido llenando los detalles a continuación.
            </p>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
