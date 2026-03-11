import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { getFeaturedProducts, getFeaturedVehicles } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const featuredVehicles = await getFeaturedVehicles();

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tight leading-tight">
            La Experiencia BMW Definitiva
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200">
            Descubra una selección curada de repuestos premium y vehículos meticulosamente inspeccionados.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="font-semibold text-lg">
              <Link href="/parts">Comprar Repuestos</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-semibold text-lg">
              <Link href="/vehicles">Ver Vehículos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline mb-12">
            Repuestos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/parts">Explorar Todos los Repuestos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline mb-12">
            Vehículos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/vehicles">Explorar Todos los Vehículos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
