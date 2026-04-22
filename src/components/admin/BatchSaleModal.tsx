
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, TrendingUp } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { processBatchSale } from '@/lib/firestore-service';
import type { Property } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  fechaVenta: z.string().min(1, 'La fecha es obligatoria'),
  compradorNombre: z.string().optional(),
  agenteResponsable: z.string().optional(),
  notasVenta: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BatchSaleModalProps {
  selectedProperties: Property[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BatchSaleModal({ selectedProperties, isOpen, onOpenChange, onSuccess }: BatchSaleModalProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaVenta: today,
      compradorNombre: '',
      agenteResponsable: '',
      notasVenta: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (selectedProperties.length === 0) return;
    setIsSubmitting(true);
    
    try {
      const result = await processBatchSale(firestore, selectedProperties, values);

      toast({ 
        title: 'Procesamiento en Lote Completo', 
        description: `Exitosos: ${result.exitosos}, Fallidos: ${result.fallidos}.`,
        variant: result.fallidos > 0 ? 'destructive' : 'default'
      });

      if (result.exitosos > 0) {
        onSuccess();
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error Crítico', description: 'No se pudo iniciar el proceso en lote.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Venta Masiva ({selectedProperties.length} propiedades)
          </DialogTitle>
          <DialogDescription>
            Registra el cierre de múltiples unidades simultáneamente. Se usarán los precios individuales de cada publicación.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaVenta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Cierre</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agenteResponsable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agente</FormLabel>
                    <FormControl><Input placeholder="Nombre del agente" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="compradorNombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Comprador</FormLabel>
                  <FormControl><Input placeholder="Opcional" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notasVenta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl><Textarea placeholder="Detalles internos..." {...field} className="h-20" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Cierre Masivo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
