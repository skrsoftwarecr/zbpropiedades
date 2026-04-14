
'use client';

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Property } from '@/lib/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { deleteProperty } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function AdminPropertiesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const q = useMemoFirebase(() => query(collection(firestore, 'properties'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: properties, isLoading } = useCollection<Property>(q);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Property | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  };

  const handleEdit = (p: Property) => { setSelected(p); setIsFormOpen(true); };
  const handleDelete = (id: string) => { 
    if(confirm('¿Seguro?')) {
        deleteProperty(firestore, id);
        toast({ title: 'Eliminado' });
    }
  };

  const columns: ColumnDef<Property>[] = [
    {
        accessorKey: 'imageUrls',
        header: 'Imagen',
        cell: ({ row }) => (
            <div className="w-12 h-12 relative rounded overflow-hidden">
                <Image src={row.original.imageUrls[0]} alt="p" fill className="object-cover" />
            </div>
        )
    },
    { accessorKey: 'title', header: 'Título' },
    { accessorKey: 'type', header: 'Tipo' },
    { 
        accessorKey: 'price', 
        header: 'Precio',
        cell: ({ row }) => formatPrice(row.original.price)
    },
    { accessorKey: 'city', header: 'Ciudad' },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEdit(row.original)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-destructive">Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  ];

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestión de Propiedades</h1>
        <Button onClick={() => { setSelected(null); setIsFormOpen(true); }}>Agregar Propiedad</Button>
      </div>
      <DataTable columns={columns} data={properties || []} />
      <PropertyForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} property={selected} />
    </>
  );
}
