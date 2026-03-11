import Image from 'next/image';
import Link from 'next/link';
import { Gauge, Calendar, Car } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Vehicle } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const vehicleImage = PlaceHolderImages.find(p => p.id === vehicle.imageIds[0]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="block group">
      <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:border-primary/50">
        <CardHeader className="p-0 relative">
          <div className="aspect-video w-full overflow-hidden">
            {vehicleImage && (
              <Image
                src={vehicleImage.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={vehicleImage.imageHint}
              />
            )}
          </div>
          <Badge variant="secondary" className="absolute top-3 right-3">{formatPrice(vehicle.price)}</Badge>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </CardTitle>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span>{vehicle.mileage.toLocaleString('es-CR')} km</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
