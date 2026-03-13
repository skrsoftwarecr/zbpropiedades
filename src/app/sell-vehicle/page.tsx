import type { Metadata } from 'next';
import { Handshake } from 'lucide-react';
import { SellVehicleForm } from '@/components/forms/SellVehicleForm';

export const metadata: Metadata = {
  title: 'Vende tu Vehículo con Bimmer CR',
  description: '¿Tienes un BMW o vehículo europeo para vender en Costa Rica? Contáctanos para una valoración justa y un proceso rápido y seguro. ¡Negociemos!',
};

export default function SellVehiclePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
       <div className="text-center mb-12">
        <Handshake className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-bold font-headline">Vende tu Vehículo con Nosotros</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          ¿Tienes un BMW o vehículo europeo que quieres vender? Te ofrecemos un precio justo y un proceso rápido y seguro. Completa el formulario para iniciar.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <SellVehicleForm />
      </div>
    </div>
  );
}
