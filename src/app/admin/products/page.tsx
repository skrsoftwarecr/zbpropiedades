'use client';

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/components/admin/ProductForm';
import { deleteProduct } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const productsQuery = useMemoFirebase(() => query(collection(firestore, 'products'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleEdit = React.useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  }, []);

  const handleAddNew = React.useCallback(() => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  }, []);

  const handleDelete = React.useCallback((productId: string) => {
    try {
        deleteProduct(firestore, productId);
        toast({ title: 'Repuesto Eliminado', description: 'El repuesto se ha eliminado correctamente.' });
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el repuesto.' });
    }
  }, [firestore, toast]);

  const columns = React.useMemo(() => getColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);
  
  if (isLoading) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">Repuestos</h1>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-72 w-full" />
                <Skeleton className="h-10 w-48 ml-auto" />
            </div>
        </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Gestión de Repuestos</h1>
        <Button onClick={handleAddNew}>Agregar Nuevo Repuesto</Button>
      </div>
      <DataTable columns={columns} data={products || []} />
      <ProductForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} product={selectedProduct} />
    </>
  );
}
