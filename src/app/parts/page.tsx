'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import Link from 'next/link';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ModelCategoryCard = ({ title, description, href }: { title: string, description: string, href: string }) => (
    <Link href={href} className="block group">
        <Card className="flex flex-col items-center justify-center p-8 text-center h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50">
            <Car className="h-12 w-12 text-primary mb-4 transition-transform group-hover:scale-110" />
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription className="mt-2 text-sm">{description}</CardDescription>
        </Card>
    </Link>
)

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

      <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-headline text-center mb-8">Explorar por Modelo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ModelCategoryCard 
                  title="Repuestos para E36"
                  description="Descubra nuestra selección curada para el icónico BMW E36."
                  href="/parts/e36"
              />
              <ModelCategoryCard 
                  title="Repuestos para E46"
                  description="Encuentre todo lo que necesita para su BMW E46, un clásico moderno."
                  href="/parts/e46"
              />
          </div>
      </div>

      <Separator className="mb-16" />

      <h2 className="text-2xl md:text-3xl font-bold font-headline text-center mb-12">Todos los Repuestos</h2>
      <ProductGrid products={allProducts || []} isLoading={isLoading} />
    </div>
  );
}
