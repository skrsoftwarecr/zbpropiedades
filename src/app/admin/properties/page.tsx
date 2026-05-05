
'use client';

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Property } from '@/lib/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { MarkAsSoldModal } from '@/components/admin/MarkAsSoldModal';
import { Skeleton } from '@/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Tag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { markPropertyAsSold } from '@/lib/firestore-service';
import { formatCurrency } from '@/lib/currency';

export default function AdminPropertiesPage() {
  const firestore = useFirestore();
  
  const q = useMemoFirebase(() => query(collection(firestore, 'properties'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: properties, isLoading } = useCollection<Property>(q);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Property | null>(null);
  const [soldProperty, setSoldProperty] = React.useState<Property | null>(null);

  const formatPrice = (price: number, currency?: Property['currency']) => formatCurrency(price, currency);

  const handleEdit = (p: Property) => { 
    setSelected(p); 
    setIsFormOpen(true); 
  };

  const handleConfirmSold = async (monto: number, fecha: string) => {
    if (!soldProperty) return;
    await markPropertyAsSold(firestore, soldProperty, monto, fecha);
  };

  const columns: ColumnDef<Property>[] = [
    {
        accessorKey: 'imageUrls',
        header: 'Imagen',
        cell: ({ row }) => (
            <div className="w-12 h-12 relative rounded overflow-hidden border bg-muted">
                {row.original.imageUrls?.[0] ? (
                  <Image src={row.original.imageUrls[0]} alt="p" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground">N/A</div>
                )}
            </div>
        )
    },
    { accessorKey: 'title', header: 'Título' },
    { 
        accessorKey: 'status', 
        header: 'Estado',
        cell: ({ row }) => {
            const status = row.original.status || 'Disponible';
            return (
                <Badge variant={status === 'Vendido' ? 'destructive' : 'secondary'} className={status === 'Vendido' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-green-100 text-green-700 hover:bg-green-100'}>
                    {status}
                </Badge>
            );
        }
    },
    { accessorKey: 'type', header: 'Tipo' },
    { 
        accessorKey: 'price', 
        header: 'Precio',
      cell: ({ row }) => formatPrice(row.original.price, row.original.currency)
    },
    { accessorKey: 'city', header: 'Ciudad' },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(row.original)}>Editar</DropdownMenuItem>
                    {row.original.status !== 'Vendido' && (
                        <DropdownMenuItem 
                            onClick={() => setSoldProperty(row.original)} 
                            className="text-green-600 font-medium focus:text-green-700 focus:bg-green-50"
                        >
                            <Tag className="mr-2 h-4 w-4" /> Marcar como Vendido
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  ];

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Propiedades</h1>
          <p className="text-muted-foreground text-sm">Administración total de inventario y cierres.</p>
        </div>
        <Button onClick={() => { setSelected(null); setIsFormOpen(true); }}>Agregar Propiedad</Button>
      </div>
      
      <DataTable columns={columns} data={properties || []} />
      
      <PropertyForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} property={selected} />
      
      <MarkAsSoldModal 
        item={soldProperty} 
        onOpenChange={(open) => !open && setSoldProperty(null)}
        onConfirm={handleConfirmSold}
      />
    </div>
  );
}
