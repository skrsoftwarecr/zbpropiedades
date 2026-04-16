
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';

export default function AdminPropertiesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const q = useMemoFirebase(() => query(collection(firestore, 'properties'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: properties, isLoading } = useCollection<Property>(q);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Property | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  };

  const handleEdit = (p: Property) => { 
    setSelected(p); 
    setIsFormOpen(true); 
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      deleteProperty(firestore, deleteId);
      toast({ 
        title: 'Publicación eliminada', 
        description: 'La propiedad ha sido removida del catálogo exitosamente.' 
      });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'No se pudo eliminar la propiedad. Intente de nuevo.' 
      });
    } finally {
      setDeleteId(null);
    }
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
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(row.original)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteId(row.original.id)} className="text-destructive">Eliminar</DropdownMenuItem>
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
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Propiedades</h1>
          <p className="text-muted-foreground text-sm">Venta y Alquiler de residencias y locales.</p>
        </div>
        <Button onClick={() => { setSelected(null); setIsFormOpen(true); }}>Agregar Propiedad</Button>
      </div>
      
      <DataTable columns={columns} data={properties || []} />
      
      <PropertyForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} property={selected} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta publicación?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
