'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { ProductGrid } from '@/components/products/ProductGrid';

export default function PartsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => query(collection(firestore, 'products'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: allProducts, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Catálogo de Repuestos</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Encuentre los repuestos originales y de posventa perfectos para su BMW.
        </p>
      </div>
      <ProductGrid products={allProducts || []} isLoading={isLoading} />
    </div>
  );
}
