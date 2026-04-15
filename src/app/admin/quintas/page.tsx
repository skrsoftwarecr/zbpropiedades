
'use client';

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Lot } from '@/lib/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { LotForm } from '@/components/admin/LotForm';
import { deleteLot } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminQuintasPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const q = useMemoFirebase(() => query(collection(firestore, 'lots'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: allLots, isLoading } = useCollection<Lot>(q);

  // Filtrar solo quintas client-side
  const quintas = React.useMemo(() => 
    allLots?.filter(l => l.lotType === 'Quinta') || [], 
    [allLots]
  );

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Lot | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  };

  const columns: ColumnDef<Lot>[] = [
    {
        accessorKey: 'imageUrls',
        header: 'Imagen',
        cell: ({ row }) => (
            <div className="w-12 h-12 relative rounded overflow-hidden">
                <Image src={row.original.imageUrls[0]} alt="q" fill className="object-cover" />
            </div>
        )
    },
    { accessorKey: 'title', header: 'Título' },
    { accessorKey: 'area_m2', header: 'Área' },
    { 
        accessorKey: 'price', 
        header: 'Precio',
        cell: ({ row }) => formatPrice(row.original.price)
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => { setSelected(row.original); setIsFormOpen(true); }}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { if(confirm('¿Seguro?')) deleteLot(firestore, row.original.id); }} className="text-destructive">Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  ];

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestión de Quintas</h1>
        <Button onClick={() => { setSelected(null); setIsFormOpen(true); }}>Agregar Quinta</Button>
      </div>
      <DataTable columns={columns} data={quintas} />
      <LotForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} lot={selected} defaultType="Quinta" />
    </>
  );
}
