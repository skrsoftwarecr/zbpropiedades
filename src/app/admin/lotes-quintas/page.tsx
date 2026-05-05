
'use client';

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Lot } from '@/lib/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { LotForm } from '@/components/admin/LotForm';
import { deleteLot, markLotAsSold } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Trees, Landmark, Tag } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Badge } from '@/components/ui/badge';
import { MarkAsSoldModal } from '@/components/admin/MarkAsSoldModal';
import { formatCurrency } from '@/lib/currency';

export default function AdminLotesQuintasPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const q = useMemoFirebase(() => query(collection(firestore, 'lots'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: allLots, isLoading } = useCollection<Lot>(q);

  const [activeTab, setActiveTab] = React.useState<'Lote' | 'Quinta'>('Lote');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Lot | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [soldLot, setSoldLot] = React.useState<Lot | null>(null);

  const lots = React.useMemo(() => 
    allLots?.filter(l => !l.lotType || l.lotType === 'Lote') || [], 
    [allLots]
  );

  const quintas = React.useMemo(() => 
    allLots?.filter(l => l.lotType === 'Quinta') || [], 
    [allLots]
  );

  const formatPrice = (price: number, currency?: Lot['currency']) => formatCurrency(price, currency);

  const handleConfirmSold = async (monto: number, fecha: string) => {
    if (!soldLot) return;
    await markLotAsSold(firestore, soldLot, monto, fecha);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      deleteLot(firestore, deleteId);
      toast({ 
        title: 'Registro eliminado', 
        description: 'El terreno ha sido borrado del sistema correctamente.' 
      });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Hubo un problema al intentar eliminar el registro.' 
      });
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Lot>[] = [
    {
        accessorKey: 'imageUrls',
        header: 'Imagen',
        cell: ({ row }) => (
            <div className="w-12 h-12 relative rounded overflow-hidden border bg-muted">
                {row.original.imageUrls?.[0] ? (
                  <Image src={row.original.imageUrls[0]} alt="img" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Landmark className="h-4 w-4 opacity-20" />
                  </div>
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
    { 
        accessorKey: 'area_m2', 
        header: 'Área',
        cell: ({ row }) => `${row.original.area_m2.toLocaleString()} m²`
    },
    { 
        accessorKey: 'price', 
        header: 'Precio',
      cell: ({ row }) => formatPrice(row.original.price, row.original.currency)
    },
    { accessorKey: 'city', header: 'Ubicación' },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSelected(row.original); setIsFormOpen(true); }}>Editar</DropdownMenuItem>
                    {row.original.status !== 'Vendido' && (
                        <DropdownMenuItem 
                            onClick={() => setSoldLot(row.original)} 
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Terrenos</h1>
          <p className="text-muted-foreground">Administre su inventario de lotes y quintas.</p>
        </div>
        <Button onClick={() => { setSelected(null); setIsFormOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Agregar {activeTab}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="Lote" className="gap-2">
            <Landmark className="h-4 w-4" /> Lotes
          </TabsTrigger>
          <TabsTrigger value="Quinta" className="gap-2">
            <Trees className="h-4 w-4" /> Quintas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="Lote" className="mt-6 border-none p-0">
          <DataTable columns={columns} data={lots} />
        </TabsContent>
        
        <TabsContent value="Quinta" className="mt-6 border-none p-0">
          <DataTable columns={columns} data={quintas} />
        </TabsContent>
      </Tabs>

      <LotForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        lot={selected} 
        defaultType={activeTab} 
      />

      <MarkAsSoldModal 
        item={soldLot} 
        onOpenChange={(open) => !open && setSoldLot(null)}
        onConfirm={handleConfirmSold}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este terreno?
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
    </div>
  );
}
