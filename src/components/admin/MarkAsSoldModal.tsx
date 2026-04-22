
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  montoVenta: z.coerce.number().min(1, 'El monto debe ser mayor a 0'),
  fechaVenta: z.string().min(1, 'La fecha de venta es obligatoria'),
});

type FormValues = z.infer<typeof formSchema>;

interface MarkAsSoldModalProps {
  item: { id: string; title: string } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (monto: number, fecha: string) => Promise<void>;
}

export function MarkAsSoldModal({ item, onOpenChange, onConfirm }: MarkAsSoldModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montoVenta: 0,
      fechaVenta: today,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!item) return;
    setIsSubmitting(true);
    try {
      await onConfirm(values.montoVenta, values.fechaVenta);
      toast({ title: '¡Venta Registrada!', description: 'Marcado como vendido correctamente.' });
      onOpenChange(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo registrar la venta.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Registrar Venta</DialogTitle>
        </DialogHeader>
        <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
                Ingrese los detalles del cierre para <strong>{item?.title}</strong>.
            </p>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="montoVenta"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monto de venta (₡)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ej: 50000000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="fechaVenta"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fecha de venta</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancelar</Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar Venta
                    </Button>
                </DialogFooter>
            </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
