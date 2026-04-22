
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowSelectionChange?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  // Notificar al padre cuando cambie la selección
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedData = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onRowSelectionChange(selectedData);
    }
  }, [rowSelection, table, onRowSelectionChange]);

  return (
    <div>
        <div className="rounded-md border bg-white">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    );
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay resultados.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
            </div>
            <div className="flex items-center space-x-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                Anterior
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                Siguiente
                </Button>
            </div>
      </div>
    </div>
  );
}
