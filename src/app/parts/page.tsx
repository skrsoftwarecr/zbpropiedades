import { getProducts } from '@/lib/actions';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Repuestos para BMW',
  description: 'Explore nuestro extenso catálogo de repuestos originales y aftermarket para todos los modelos de BMW en Costa Rica. Filtre por modelo y categoría.',
};

export default async function PartsPage() {
  const allProducts = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Catálogo de Repuestos</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Encuentre los repuestos originales y de posventa perfectos para su BMW. Use los filtros para encontrar exactamente lo que necesita.
        </p>
      </div>
      <ProductGrid products={allProducts || []} isLoading={false} />
    </div>
  );
}
