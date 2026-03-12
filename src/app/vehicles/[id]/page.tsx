'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { VehicleDetails } from '@/components/vehicles/VehicleDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AppointmentForm } from '@/components/vehicles/AppointmentForm';
import type { Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const VehicleDetailSkeleton = () => (
    <div>
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
            </div>
             <div className="lg:col-span-2 flex flex-col space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
            </div>
            <div className="lg:col-span-5 mt-8 space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-1/4 mt-8" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-28" />
                </div>
            </div>
        </div>
         <Separator className="my-12 md:my-16" />
        <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
            <Skeleton className="h-96 w-full" />
        </div>
    </div>
)

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.id as string;
  const firestore = useFirestore();

  const vehicleRef = useMemoFirebase(() => doc(firestore, 'vehicles', vehicleId), [firestore, vehicleId]);
  const { data: vehicle, isLoading } = useDoc<Vehicle>(vehicleRef);

  if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <VehicleDetailSkeleton />
        </div>
      )
  }

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
            <Button variant="ghost" asChild>
                <Link href="/vehicles">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Volver a Vehículos
                </Link>
            </Button>
        </div>
        <VehicleDetails vehicle={vehicle} />

        <Separator className="my-12 md:my-16" />

        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-headline text-center mb-8">Agendar una Inspección</h2>
            <AppointmentForm vehicleId={vehicle.id} />
        </div>
    </div>
  );
}
