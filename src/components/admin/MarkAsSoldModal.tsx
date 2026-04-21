
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { markPropertyAsSold } from '@/lib/firestore-service';
import { notifyPropertySale } from '@/lib/actions';
import type { Property } from '@/lib/types';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  montoVenta: z.coerce.number().min(1, 'El monto debe ser mayor a 0'),
  fechaVenta: z.date({
    required_error: "La fecha de venta es obligatoria",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface MarkAsSoldModalProps {
  property: Property | null;
  onOpenChange: (open: boolean) => void;
}

export function MarkAsSoldModal({ property, onOpenChange }: MarkAsSoldModalProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montoVenta: 0,
      fechaVenta: new Date(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!property) return;
    setIsSubmitting(true);
    try {
      // 1. Update Firestore
      await markPropertyAsSold(firestore, property.id, values.montoVenta, values.fechaVenta);

      // 2. Notify by Email
      await notifyPropertySale({
        title: property.title,
        type: property.type,
        city: property.city,
        price: values.montoVenta,
        date: values.fechaVenta,
      });

      toast({ 
        title: '¡Venta Registrada!', 
        description: 'Propiedad marcada como vendida correctamente.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'No se pudo registrar la venta.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!property} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Registrar Venta</DialogTitle>
        </DialogHeader>
        <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
                Ingrese los detalles del cierre para <strong>{property?.title}</strong>.
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
                    <FormItem className="flex flex-col">
                    <FormLabel>Fecha de venta</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: es })
                            ) : (
                                <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={es}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <DialogFooter className="pt-4">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={isSubmitting}
                    >
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
