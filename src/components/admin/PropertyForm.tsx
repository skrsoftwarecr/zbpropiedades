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
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Sheet as SheetRoot } from '@/components/ui/sheet';
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
import { Switch } from '@/components/ui/switch';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(5, 'Título muy corto.'),
  description: z.string().min(10, 'Descripción muy corta.'),
  price: z.coerce.number().min(0),
  type: z.enum(['Casa', 'Apartamento', 'Local Comercial']),
  operationType: z.enum(['Venta', 'Alquiler']),
  province: z.enum(["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"]),
  city: z.string().min(2),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  parking: z.coerce.number().int().min(0),
  area_m2: z.coerce.number().min(1),
  features: z.string().min(1),
  mapUrl: z.string().optional(),
  // Campos de Alquiler
  incluyeServicios: z.boolean().default(false),
  tieneWifi: z.boolean().default(false),
  estaAmueblado: z.boolean().default(false),
});

type PropertyFormValues = z.infer<typeof formSchema>;

export function PropertyForm({ isOpen, onOpenChange, property }: { isOpen: boolean, onOpenChange: (o: boolean) => void, property?: Property | null }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!property;
  const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false);
  const widgetRef = React.useRef<any>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operationType: 'Venta',
      incluyeServicios: false,
      tieneWifi: false,
      estaAmueblado: false,
    }
  });

  const operationType = form.watch('operationType');
  
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: property?.title || '',
        description: property?.description || '',
        price: property?.price || 0,
        type: (property?.type as any) === 'Lote' || (property?.type as any) === 'Quinta' ? 'Casa' : (property?.type as any) || 'Casa',
        operationType: property?.operationType || 'Venta',
        province: property?.province || 'San José',
        city: property?.city || '',
        bedrooms: property?.bedrooms || 0,
        bathrooms: property?.bathrooms || 0,
        parking: property?.parking || 0,
        area_m2: property?.area_m2 || 0,
        features: property?.features.join('\n') || '',
        mapUrl: property?.mapUrl || '',
        incluyeServicios: property?.incluyeServicios || false,
        tieneWifi: property?.tieneWifi || false,
        estaAmueblado: property?.estaAmueblado || false,
      });
      setUploadedImages(property?.imageUrls || []);
    }
  }, [property, isOpen, form]);

  // Limpiar campos de alquiler si se cambia a Venta
  React.useEffect(() => {
    if (operationType === 'Venta') {
      form.setValue('incluyeServicios', false);
      form.setValue('tieneWifi', false);
      form.setValue('estaAmueblado', false);
    }
  }, [operationType, form]);

  const openWidget = () => {
    if (!(window as any).cloudinary) return;
    if (!widgetRef.current) {
      widgetRef.current = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: 'daylj7uv8',
          uploadPreset: 'zb_propieties',
          sources: ['local', 'url', 'camera'],
          multiple: true,
          language: 'es',
          styles: { zIndex: 100000 }
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            setUploadedImages(prev => [...prev, result.info.secure_url]);
          }
          if (result && result.event === "close") {
            setIsWidgetOpen(false);
            document.body.style.pointerEvents = 'auto';
          }
        }
      );
    }
    setIsWidgetOpen(true);
    document.body.style.pointerEvents = 'auto';
    widgetRef.current.open();
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: PropertyFormValues) => {
    if (uploadedImages.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Suba al menos una imagen.' });
      return;
    }
    try {
      const processedData: any = {
        ...values,
        imageUrls: uploadedImages,
        features: values.features.split('\n').map(item => item.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      };

      // Limpiar campos si no es alquiler antes de guardar
      if (values.operationType === 'Venta') {
        delete processedData.incluyeServicios;
        delete processedData.tieneWifi;
        delete processedData.estaAmueblado;
      }

      if (isEditing && property) {
        await updateDoc(doc(firestore, 'properties', property.id), processedData);
        toast({ title: 'Actualizado' });
      } else {
        const newDocRef = doc(collection(firestore, 'properties'));
        await setDoc(newDocRef, { ...processedData, id: newDocRef.id, createdAt: serverTimestamp() });
        toast({ title: 'Creado' });
      }
      onOpenChange(false);
    } catch (error: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        operation: isEditing ? 'update' : 'create',
        path: `properties/${property?.id || 'new'}`,
        requestResourceData: values,
      }));
    }
  };

  return (
    <SheetRoot open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <SheetContent 
        className="sm:max-w-2xl w-[90vw] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}</SheetTitle>
          <SheetDescription>Complete los datos de la propiedad residencial o comercial.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{operationType === 'Alquiler' ? 'Precio por mes (₡)' : 'Precio (₡)'}</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="operationType" render={({ field }) => (
                    <FormItem><FormLabel>Operación</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Venta">Venta</SelectItem>
                                <SelectItem value="Alquiler">Alquiler</SelectItem>
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
            </div>

            {operationType === 'Alquiler' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
                <FormField
                  control={form.control}
                  name="incluyeServicios"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                      <div className="space-y-0.5">
                        <FormLabel>Servicios</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tieneWifi"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                      <div className="space-y-0.5">
                        <FormLabel>Wi-Fi</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estaAmueblado"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                      <div className="space-y-0.5">
                        <FormLabel>Amueblado</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Casa">Casa</SelectItem>
                                <SelectItem value="Apartamento">Apartamento</SelectItem>
                                <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="province" render={({ field }) => (
                    <FormItem><FormLabel>Provincia</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="area_m2" render={({ field }) => (
                    <FormItem><FormLabel>Área m²</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
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
            </div>

            <div className="space-y-3 pt-2">
              <FormLabel>Galería de Imágenes</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border">
                    <Image src={url} alt={`img-${idx}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl-md"><X className="h-3 w-3" /></button>
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
                <FormItem><FormLabel>Google Maps</FormLabel><FormControl><Input {...field} placeholder="Enlace o iframe" /></FormControl><FormMessage /></FormItem>
            )} />

            <SheetFooter className="pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">Guardar Cambios</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </SheetRoot>
  );
}