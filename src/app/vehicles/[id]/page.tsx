import { getVehicleById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AppointmentForm } from '@/components/vehicles/AppointmentForm';
import { VehicleDetails } from '@/components/vehicles/VehicleDetails';
import type { Vehicle } from '@/lib/types';


type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicle = await getVehicleById(params.id);

  if (!vehicle) {
    return {
      title: 'Vehículo no encontrado',
      description: 'El vehículo que busca no existe o ya no está disponible en Bimmer CR.',
    }
  }
  
  const title = `BMW ${vehicle.model} ${vehicle.year} a la venta en Costa Rica`;
  const description = `Venta de BMW ${vehicle.model} ${vehicle.year} en Bimmer CR. ${vehicle.description.substring(0, 120)}... Kilometraje: ${vehicle.mileage.toLocaleString('es-CR')} km. VIN: ${vehicle.vin}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: vehicle.imageUrls[0] ? [
        {
          url: vehicle.imageUrls[0],
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
    },
  }
}

export default async function VehicleDetailPage({ params }: Props) {
  const vehicle = await getVehicleById(params.id);

  if (!vehicle) {
    notFound();
  }

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "name": `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    "brand": {
      "@type": "Brand",
      "name": vehicle.make
    },
    "model": vehicle.model,
    "vehicleModelDate": vehicle.year,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": vehicle.mileage,
      "unitCode": "KMT"
    },
    "vehicleIdentificationNumber": vehicle.vin,
    "description": vehicle.description,
    "image": vehicle.imageUrls,
    "offers": {
      "@type": "Offer",
      "url": `https://www.bimmercr.com/vehicles/${vehicle.id}`,
      "priceCurrency": "CRC",
      "price": vehicle.price,
      "availability": vehicle.availabilityStatus === 'Available' ? "https://schema.org/InStock" : "https://schema.org/Sold"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
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
    </>
  );
}
