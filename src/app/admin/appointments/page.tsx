'use client';

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Appointment } from '@/lib/types';
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { updateAppointmentStatus } from '@/lib/firestore-service';

export default function AdminAppointmentsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const appointmentsQuery = useMemoFirebase(
    () => query(collection(firestore, 'appointments'), orderBy('createdAt', 'desc')),
    [firestore]
  );
  const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

  const handleStatusChange = (appointmentId: string, status: 'Completed' | 'Cancelled') => {
    try {
      updateAppointmentStatus(firestore, appointmentId, status);
      toast({ title: 'Estado Actualizado', description: `La cita ha sido marcada como ${status}.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el estado de la cita.' });
    }
  };

  const columns = React.useMemo(() => getColumns({ onStatusChange: handleStatusChange }), [firestore]);

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold md:text-2xl">Citas Agendadas</h1>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-10 w-48 ml-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Gestión de Citas Agendadas</h1>
      </div>
      <DataTable columns={columns} data={appointments || []} />
    </>
  );
}

    