'use client';

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { VehicleForm } from '@/components/admin/VehicleForm';
import { deleteVehicle } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminVehiclesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const vehiclesQuery = useMemoFirebase(() => query(collection(firestore, 'vehicles'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: vehicles, isLoading } = useCollection<Vehicle>(vehiclesQuery);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);

  const handleEdit = React.useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  }, []);
  
  const handleAddNew = React.useCallback(() => {
    setSelectedVehicle(null);
    setIsFormOpen(true);
  }, []);

  const handleDelete = React.useCallback((vehicleId: string) => {
    try {
        deleteVehicle(firestore, vehicleId);
        toast({ title: 'Vehículo Eliminado', description: 'El vehículo se ha eliminado correctamente.' });
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el vehículo.' });
    }
  }, [firestore, toast]);

  const columns = React.useMemo(() => getColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);

   if (isLoading) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">Vehículos</h1>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-72 w-full" />
                <Skeleton className="h-10 w-48 ml-auto" />
            </div>
        </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Gestión de Vehículos</h1>
        <Button onClick={handleAddNew}>Agregar Nuevo Vehículo</Button>
      </div>
      <DataTable columns={columns} data={vehicles || []} />
      <VehicleForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} vehicle={selectedVehicle} />
    </>
  );
}
