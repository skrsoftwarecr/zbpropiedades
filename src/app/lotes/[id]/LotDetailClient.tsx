'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Lot } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { LotDetails } from '@/components/lots/LotDetails';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  id: string;
}

export default function LotDetailClient({ id }: Props) {
  const firestore = useFirestore();

  const lotRef = useMemoFirebase(() => doc(firestore, 'lots', id), [firestore, id]);
  const { data: lot, isLoading } = useDoc<Lot>(lotRef);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Lote no encontrado</h2>
        <p className="text-muted-foreground mb-8">El terreno que busca no existe o ya no está disponible.</p>
        <Button asChild>
          <Link href="/lotes">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-primary">
            <Link href="/lotes">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver a Lotes
            </Link>
          </Button>
        </div>

        <LotDetails lot={lot} />
      </div>
    </div>
  );
}
