'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { ProductDetails } from '@/components/products/ProductDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="w-full">
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <div className="pt-6 border-t space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-auto pt-6 space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
)

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const firestore = useFirestore();

  const productRef = useMemoFirebase(() => doc(firestore, 'products', productId), [firestore, productId]);
  const { data: product, isLoading } = useDoc<Product>(productRef);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <ProductDetailSkeleton />
        </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
            <Button variant="ghost" asChild>
                <Link href="/parts">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Volver a Repuestos
                </Link>
            </Button>
        </div>
        <ProductDetails product={product} />
    </div>
  );
}
