import { getVehicles } from '@/lib/actions';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';

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
