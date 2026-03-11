import { getVehicles } from '@/lib/actions';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vehículos BMW Usados en Venta',
  description: 'Explore nuestra selección de vehículos BMW usados y certificados en Costa Rica. Encuentre el M2, M4, X5 y más modelos en excelentes condiciones en Bimmer CR.',
};

export default async function VehiclesPage() {
  const allVehicles = await getVehicles();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Vehículos Usados</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore nuestra colección de BMWs pre-seleccionados y certificados.
        </p>
      </div>
      <VehicleGrid vehicles={allVehicles} />
    </div>
  );
}
