import Image from 'next/image';
import { Car, Gauge, GitBranch, PaintBucket, Palette, Wrench } from 'lucide-react';

import type { Vehicle } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from '../ui/badge';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const SpecItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg text-center">
        <Icon className="h-8 w-8 text-primary mb-2" />
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
)

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-3">
         <Carousel className="w-full rounded-lg overflow-hidden border">
            <CarouselContent>
                {vehicle.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-video relative w-full">
                            <Image
                                src={url}
                                alt={`${vehicle.make} ${vehicle.model} image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
        </Carousel>
      </div>

      <div className="lg:col-span-2 flex flex-col">
        <h1 className="text-3xl lg:text-4xl font-bold font-headline">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
        <p className="text-3xl font-bold my-4 text-primary">{formatPrice(vehicle.price)}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
            <SpecItem icon={Gauge} label="Kilometraje" value={`${vehicle.mileage.toLocaleString('es-CR')} km`} />
            <SpecItem icon={Wrench} label="Motor" value={vehicle.engine} />
            <SpecItem icon={GitBranch} label="Transmisión" value={vehicle.transmission} />
            <SpecItem icon={PaintBucket} label="Exterior" value={vehicle.exteriorColor} />
            <SpecItem icon={Palette} label="Interior" value={vehicle.interiorColor} />
            <SpecItem icon={Car} label="VIN" value={vehicle.vin.slice(0, 8) + '...'} />
        </div>
      </div>

      <div className="lg:col-span-5 mt-8">
        <h2 className="text-2xl font-bold font-headline mb-4">Descripción</h2>
        <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
        
        <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Características</h2>
        <div className="flex flex-wrap gap-2">
            {vehicle.features.map(feature => (
                <Badge key={feature} variant="secondary">{feature}</Badge>
            ))}
        </div>
      </div>
    </div>
  );
}
