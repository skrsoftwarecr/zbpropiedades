'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { addVehicle, updateVehicle } from '@/lib/firestore-service';
import type { Vehicle } from '@/lib/types';
import React from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  model: z.string().min(1, 'El modelo es requerido.'),
  year: z.coerce.number().int().min(1980, 'El año no es válido.').max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
  mileage: z.coerce.number().int().min(0, 'El kilometraje no puede ser negativo.'),
  vin: z.string().min(5, 'El VIN es muy corto.'),
  engine: z.string().min(3, 'El motor es requerido.'),
  transmission: z.enum(['Automático', 'Manual']),
  exteriorColor: z.string().min(3, 'El color es requerido.'),
  interiorColor: z.string().min(3, 'El color es requerido.'),
  availabilityStatus: z.enum(['Available', 'Pending Inspection', 'Sold']),
  description: z.string().min(10, 'La descripción es muy corta.'),
  features: z.string().min(1, 'Agregue al menos una característica.'),
  imageUrls: z.string().min(1, 'Agregue al menos una URL de imagen.'),
});

type VehicleFormValues = z.infer<typeof formSchema>;

interface VehicleFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  vehicle?: Vehicle | null;
}

export function VehicleForm({ isOpen, onOpenChange, vehicle }: VehicleFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!vehicle;

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(formSchema),
  });
  
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        model: vehicle?.model || '',
        year: vehicle?.year || new Date().getFullYear(),
        price: vehicle?.price || 0,
        mileage: vehicle?.mileage || 0,
        vin: vehicle?.vin || '',
        engine: vehicle?.engine || '',
        transmission: vehicle?.transmission || 'Automático',
        exteriorColor: vehicle?.exteriorColor || '',
        interiorColor: vehicle?.interiorColor || '',
        availabilityStatus: vehicle?.availabilityStatus || 'Available',
        description: vehicle?.description || '',
        features: vehicle?.features.join('\n') || '',
        imageUrls: vehicle?.imageUrls.join('\n') || '',
      });
    }
  }, [vehicle, isOpen, form]);

  const onSubmit = async (data: VehicleFormValues) => {
    const processedData = {
      make: 'BMW' as const,
      ...data,
      features: data.features.split('\n').map(item => item.trim()).filter(Boolean),
      imageUrls: data.imageUrls.split('\n').map(item => item.trim()).filter(Boolean),
    };

    try {
      if (isEditing && vehicle) {
        updateVehicle(firestore, vehicle.id, processedData);
        toast({ title: '¡Éxito!', description: 'Vehículo actualizado correctamente.' });
      } else {
        addVehicle(firestore, processedData);
        toast({ title: '¡Éxito!', description: 'Vehículo agregado correctamente.' });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el vehículo. Verifique los permisos.',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}</SheetTitle>
          <SheetDescription>
            {isEditing ? 'Modifique los detalles del vehículo.' : 'Complete los detalles del nuevo vehículo.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="model" render={({ field }) => (
                <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><FormLabel>Año</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Precio (CRC)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="mileage" render={({ field }) => (
                <FormItem><FormLabel>Kilometraje (km)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="vin" render={({ field }) => (
                <FormItem><FormLabel>VIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="engine" render={({ field }) => (
                <FormItem><FormLabel>Motor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="exteriorColor" render={({ field }) => (
                <FormItem><FormLabel>Color Exterior</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="interiorColor" render={({ field }) => (
                <FormItem><FormLabel>Color Interior</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="transmission" render={({ field }) => (
                <FormItem><FormLabel>Transmisión</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Automático">Automático</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
               <FormField control={form.control} name="availabilityStatus" render={({ field }) => (
                <FormItem><FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Disponible</SelectItem>
                      <SelectItem value="Pending Inspection">Pendiente Inspección</SelectItem>
                      <SelectItem value="Sold">Vendido</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
            </div>
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="features" render={({ field }) => (
                <FormItem><FormLabel>Características (una por línea)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageUrls" render={({ field }) => (
                <FormItem><FormLabel>URLs de Imagen (uno por línea)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <SheetFooter className="pt-4">
              <SheetClose asChild><Button type="button" variant="outline">Cancelar</Button></SheetClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
