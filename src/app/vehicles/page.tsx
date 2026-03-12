'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';

export default function VehiclesPage() {
  const firestore = useFirestore();
  const vehiclesQuery = useMemoFirebase(() => query(collection(firestore, 'vehicles'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: allVehicles, isLoading } = useCollection<Vehicle>(vehiclesQuery);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Vehículos Usados</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore nuestra colección de BMWs pre-seleccionados y certificados.
        </p>
      </div>
      <VehicleGrid vehicles={allVehicles || []} isLoading={isLoading} />
    </div>
  );
}
