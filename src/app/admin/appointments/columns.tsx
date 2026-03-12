'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import type { Appointment } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppointmentColumnsProps {
  onStatusChange: (appointmentId: string, status: 'Completed' | 'Cancelled') => void;
}

export const getColumns = ({ onStatusChange }: AppointmentColumnsProps): ColumnDef<Appointment>[] => [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha Solicitud
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt?.toDate();
      return <div>{date ? format(date, 'dd/MM/yyyy HH:mm') : 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Nombre Cliente',
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
  },
  {
    accessorKey: 'vehicleId',
    header: 'ID Vehículo',
  },
  {
    accessorKey: 'preferredDate',
    header: 'Fecha Preferida',
    cell: ({ row }) => {
      const date = row.original.preferredDate?.toDate();
      return <div>{date ? format(date, 'PPP', { locale: es }) : 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
      if (status === 'Completed') variant = 'default';
      if (status === 'Cancelled') variant = 'destructive';
      if (status === 'Pending') variant = 'secondary';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(appointment.id)}>
              Copiar ID Cita
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(appointment.id, 'Completed')}>
              Marcar como Completada
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(appointment.id, 'Cancelled')} className="text-destructive">
              Marcar como Cancelada
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

    