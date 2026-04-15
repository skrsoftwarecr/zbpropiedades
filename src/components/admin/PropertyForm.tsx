'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/lib/types';
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres.'),
  description: z.string().min(10, 'La descripción es muy corta.'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
  type: z.enum(['Casa', 'Apartamento', 'Local Comercial', 'Oficina', 'Quinta']),
  operationType: z.enum(['Venta', 'Alquiler']),
  province: z.enum(["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"]),
  city: z.string().min(2, 'La ciudad es requerida.'),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  parking: z.coerce.number().int().min(0),
  area_m2: z.coerce.number().min(1),
  features: z.string().min(1, 'Agregue al menos una característica.'),
  mapUrl: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  property?: Property | null;
}

export function PropertyForm({ isOpen, onOpenChange, property }: PropertyFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!property;

  const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
  });
  
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: property?.title || '',
        description: property?.description || '',
        price: property?.price || 0,
        type: property?.type || 'Casa',
        operationType: property?.operationType || 'Venta',
        province: property?.province || 'San José',
        city: property?.city || '',
        bedrooms: property?.bedrooms || 0,
        bathrooms: property?.bathrooms || 0,
        parking: property?.parking || 0,
        area_m2: property?.area_m2 || 0,
        features: property?.features.join('\n') || '',
        mapUrl: property?.mapUrl || '',
      });
      setUploadedImages(property?.imageUrls || []);
    }
  }, [property, isOpen, form]);

  const openWidget = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'daylj7uv8',
        uploadPreset: 'zb_propieties',
        sources: ['local', 'url', 'camera'],
        multiple: true,
        language: 'es',
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setUploadedImages(prev => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: PropertyFormValues) => {
    if (uploadedImages.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debe subir al menos una imagen.' });
      return;
    }

    try {
      const processedData = {
        ...values,
        imageUrls: uploadedImages,
        features: values.features.split('\n').map(item => item.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      };

      if (isEditing && property) {
        const docRef = doc(firestore, 'properties', property.id);
        await updateDoc(docRef, processedData);
        toast({ title: 'Actualizado' });
      } else {
        const colRef = collection(firestore, 'properties');
        const newDocRef = doc(colRef);
        await setDoc(newDocRef, {
          ...processedData,
          id: newDocRef.id,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Creado' });
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      const contextualError = new FirestorePermissionError({
        operation: isEditing ? 'update' : 'create',
        path: `properties/${property?.id || 'new'}`,
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', contextualError);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}</SheetTitle>
          <SheetDescription>Complete los datos de la propiedad.</SheetDescription>
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
                <FormField control={form.control} name="operationType" render={({ field }) => (
                    <FormItem><FormLabel>Operación</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Venta">Venta</SelectItem>
                                <SelectItem value="Alquiler">Alquiler</SelectItem>
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {['Casa', 'Apartamento', 'Local Comercial', 'Oficina', 'Quinta'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="area_m2" render={({ field }) => (
                    <FormItem><FormLabel>Área m²</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <FormField control={form.control} name="bedrooms" render={({ field }) => (
                    <FormItem><FormLabel>Hab.</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bathrooms" render={({ field }) => (
                    <FormItem><FormLabel>Baños</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="parking" render={({ field }) => (
                    <FormItem><FormLabel>Parqueo</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="space-y-3 pt-2">
              <FormLabel>Galería de Imágenes</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border">
                    <Image src={url} alt={`img-${idx}`} fill className="object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button type="button" onClick={openWidget} variant="secondary" className="w-full">
                <ImagePlus className="mr-2 h-4 w-4" /> Subir Fotos
              </Button>
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <FormField control={form.control} name="features" render={({ field }) => (
                <FormItem><FormLabel>Características (una por línea)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <FormField control={form.control} name="mapUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps</FormLabel>
                  <FormControl><Input {...field} placeholder="Pegue aquí el enlace o iframe" /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />

            <SheetFooter className="pt-4">
              <SheetClose asChild><Button type="button" variant="outline">Cancelar</Button></SheetClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Guardar Cambios
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
