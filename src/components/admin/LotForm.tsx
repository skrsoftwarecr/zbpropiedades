
'use client';

import * as React from 'react';
import { useSafeLayoutEffect } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { addLot, updateLot } from '@/lib/firestore-service';
import type { Lot } from '@/lib/types';

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
  FormDescription,
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
  title: z.string().min(5, 'Mínimo 5 caracteres.'),
  description: z.string().min(10, 'Mínimo 10 caracteres.'),
  price: z.coerce.number().min(0),
  province: z.enum(["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"]),
  city: z.string().min(2),
  area_m2: z.coerce.number().min(1),
  topography: z.string().min(2),
  features: z.string().min(1),
  imageUrls: z.string().min(1),
  mapUrl: z.string().optional(),
});

type LotFormValues = z.infer<typeof formSchema>;

export function LotForm({ isOpen, onOpenChange, lot }: { isOpen: boolean, onOpenChange: (o: boolean) => void, lot?: Lot | null }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!lot;

  const form = useForm<LotFormValues>({ resolver: zodResolver(formSchema) });
  
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: lot?.title || '',
        description: lot?.description || '',
        price: lot?.price || 0,
        province: lot?.province || 'San José',
        city: lot?.city || '',
        area_m2: lot?.area_m2 || 0,
        topography: lot?.topography || 'Plana',
        features: lot?.features.join('\n') || '',
        imageUrls: lot?.imageUrls.join('\n') || '',
        mapUrl: lot?.mapUrl || '',
      });
    }
  }, [lot, isOpen, form]);

  const onSubmit = async (data: LotFormValues) => {
    const processed = {
      ...data,
      features: data.features.split('\n').map(i => i.trim()).filter(Boolean),
      imageUrls: data.imageUrls.split('\n').map(i => i.trim()).filter(Boolean),
    };

    try {
      if (isEditing && lot) {
        updateLot(firestore, lot.id, processed);
        toast({ title: 'Actualizado' });
      } else {
        addLot(firestore, processed);
        toast({ title: 'Creado' });
      }
      onOpenChange(false);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error' });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Lote' : 'Nuevo Lote'}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Precio (₡)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="area_m2" render={({ field }) => (
                    <FormItem><FormLabel>Área m²</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="province" render={({ field }) => (
                    <FormItem><FormLabel>Provincia</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField control={form.control} name="topography" render={({ field }) => (
                <FormItem><FormLabel>Topografía</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="features" render={({ field }) => (
                <FormItem><FormLabel>Características</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageUrls" render={({ field }) => (
                <FormItem><FormLabel>Imágenes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mapUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Google Maps (Insertar Mapa)</FormLabel>
                  <FormControl><Input {...field} placeholder="https://www.google.com/maps/embed?pb=..." /></FormControl>
                  <FormDescription>En Google Maps: Compartir → Insertar un mapa → Copiar solo el contenido de &apos;src&apos;.</FormDescription>
                  <FormMessage />
                </FormItem>
            )} />
            <SheetFooter>
              <Button type="submit">Guardar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
