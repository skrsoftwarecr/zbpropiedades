'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Vehicle } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
}

const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString('es-CR')} km`;
}

interface VehicleColumnsProps {
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicleId: string) => void;
}

export const getColumns = ({ onEdit, onDelete }: VehicleColumnsProps): ColumnDef<Vehicle>[] => [
  {
    accessorKey: 'model',
    header: 'Modelo',
    cell: ({ row }) => {
        const vehicle = row.original;
        return <div className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
    }
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue('price'))
        return <div className="text-right font-medium">{formatPrice(amount)}</div>
    }
  },
  {
    accessorKey: 'mileage',
    header: () => <div className="text-right">Kilometraje</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue('mileage'), 10)
      return <div className="text-right">{formatMileage(amount)}</div>
    },
  },
  {
    accessorKey: 'availabilityStatus',
    header: 'Estado',
    cell: ({ row }) => {
        const status = row.original.availabilityStatus;
        let variant: "default" | "secondary" | "destructive" = "default";
        if (status === 'Sold') variant = 'destructive';
        if (status === 'Pending Inspection') variant = 'secondary';

        return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const vehicle = row.original;

      return (
         <AlertDialog>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(vehicle.id)}>
                    Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(vehicle)}>Editar</DropdownMenuItem>
                 <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/30 focus:text-destructive-foreground">Eliminar</DropdownMenuItem>
                </AlertDialogTrigger>
            </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el vehículo de la base de datos.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                     <AlertDialogAction onClick={() => onDelete(vehicle.id)} className="bg-destructive hover:bg-destructive/90">
                        Sí, eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
