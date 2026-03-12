import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { getFeaturedProducts, getFeaturedVehicles } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Ticker } from '@/components/shared/Ticker';
import { ArrowRight, Wrench, Car } from 'lucide-react';

const CommercialBlock = ({
  title,
  href,
  imageId,
}: {
  title: string;
  href: string;
  imageId: string;
}) => {
  const image = PlaceHolderImages.find((p) => p.id === imageId);
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
    >
      {image && (
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={image.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 text-primary-foreground">
        <h2 className="text-3xl font-bold font-headline drop-shadow-md">{title}</h2>
        <div className="mt-2 flex items-center font-semibold text-primary-foreground/90 transition-colors group-hover:text-primary">
          <span>Ver más</span>
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};


export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <div className="flex flex-col">
      <Ticker />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <CommercialBlock
              title="Repuestos"
              href="/parts"
              imageId="cta-repuestos"
            />
            <CommercialBlock
              title="Vehículos"
              href="/vehicles"
              imageId="cta-vehiculos"
            />
            <CommercialBlock
              title="Taller"
              href="/taller"
              imageId="cta-taller"
            />
          </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <Wrench className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-headline md:text-4xl">
              Repuestos Destacados
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/parts">Explorar Todos los Repuestos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <Car className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-headline md:text-4xl">
              Vehículos Destacados
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/vehicles">Explorar Todos los Vehículos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
