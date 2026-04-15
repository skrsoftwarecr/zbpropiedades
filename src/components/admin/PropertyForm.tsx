'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useStorage } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { addProperty, updateProperty } from '@/lib/firestore-service';
import type { Property } from '@/lib/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
import { Loader2, Upload, X } from 'lucide-react';
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
  const storage = useStorage();
  const { toast } = useToast();
  const isEditing = !!property;

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [existingImages, setExistingImages] = React.useState<string[]>([]);

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
      setExistingImages(property?.imageUrls || []);
      setSelectedFiles([]);
    }
  }, [property, isOpen, form]);

  const extractMapUrl = (input: string) => {
    if (input.includes('<iframe')) {
      const match = input.match(/src="([^"]+)"/);
      return match ? match[1] : input;
    }
    return input;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: PropertyFormValues) => {
    if (selectedFiles.length === 0 && existingImages.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debe subir al menos una imagen.' });
      return;
    }

    setIsUploading(true);
    try {
      let docId = property?.id;
      let finalUrls = [...existingImages];

      // Si es nueva propiedad, obtenemos un ID primero
      if (!docId) {
        const newRef = doc(collection(firestore, 'properties'));
        docId = newRef.id;
      }

      // 1. Subida de archivos a Storage
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const storageRef = ref(storage, `properties/${docId}/${Date.now()}-${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
        });
        const newUrls = await Promise.all(uploadPromises);
        finalUrls = [...finalUrls, ...newUrls];
      }

      // 2. Preparar datos para Firestore
      const processedData = {
        ...values,
        imageUrls: finalUrls,
        mapUrl: extractMapUrl(values.mapUrl || ''),
        features: values.features.split('\n').map(item => item.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      };

      // 3. Guardar en Firestore
      const docRef = doc(firestore, 'properties', docId);
      if (isEditing) {
        await updateDoc(docRef, processedData);
        toast({ title: 'Actualizado', description: 'Propiedad actualizada correctamente.' });
      } else {
        await setDoc(docRef, {
          ...processedData,
          id: docId,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Creado', description: 'Propiedad agregada correctamente.' });
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
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron subir los datos.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}</SheetTitle>
          <SheetDescription>Complete los datos y suba las fotografías de la propiedad.</SheetDescription>
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
                    <FormItem><FormLabel>Tipo de Operación</FormLabel>
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

            <div className="space-y-2">
              <FormLabel>Fotografías</FormLabel>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                    <Image src={url} alt="prop" fill className="object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <FormControl>
                <div className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer relative">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Haga clic para seleccionar fotos</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </FormControl>
              {selectedFiles.length > 0 && (
                <p className="text-xs font-medium text-primary mt-2">
                  {selectedFiles.length} archivos nuevos seleccionados
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Tipo de Propiedad</FormLabel>
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
                    <FormItem><FormLabel>Ciudad / Cantón</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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

            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="features" render={({ field }) => (
                <FormItem><FormLabel>Características (una por línea)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mapUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps (Insertar mapa)</FormLabel>
                  <FormControl><Input {...field} placeholder="Pegue aquí el enlace src o el código iframe completo" /></FormControl>
                  <FormDescription>Puede pegar el código completo de &apos;Insertar un mapa&apos; de Google Maps.</FormDescription>
                  <FormMessage />
                </FormItem>
            )} />

            <SheetFooter className="pt-4">
              <SheetClose asChild><Button type="button" variant="outline" disabled={isUploading}>Cancelar</Button></SheetClose>
              <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo imágenes...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
