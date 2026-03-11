import { getVehicleById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { VehicleDetails } from '@/components/vehicles/VehicleDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AppointmentForm } from '@/components/vehicles/AppointmentForm';
import type { Metadata } from 'next';
import type { Vehicle } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type VehicleDetailPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  const vehicle: Vehicle | undefined = await getVehicleById(params.id);

  if (!vehicle) {
    return {
      title: 'Vehículo no encontrado',
    }
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const vehicleImage = PlaceHolderImages.find(p => p.id === vehicle.imageIds[0]);

  return {
    title: title,
    description: vehicle.description,
    openGraph: {
      title: title,
      description: vehicle.description,
      images: vehicleImage ? [
        {
          url: vehicleImage.imageUrl,
          width: 600,
          height: 400,
          alt: title,
        }
      ] : [],
    }
  }
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const vehicle = await getVehicleById(params.id);

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
