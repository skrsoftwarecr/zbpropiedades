'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { addLot, updateLot, deleteLotPermanent } from '@/lib/firestore-service';
import type { Lot } from '@/lib/types';
import { currencySymbol } from '@/lib/currency';
import { ImagePlus, X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import Image from 'next/image';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres.'),
  description: z.string().min(10, 'Mínimo 10 caracteres.'),
  lotType: z.enum(['Lote', 'Quinta']),
  price: z.coerce.number().min(0),
  currency: z.enum(['CRC', 'USD']),
  province: z.enum(["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"]),
  city: z.string().min(2),
  area_m2: z.coerce.number().min(1),
  topography: z.string().min(2),
  features: z.string().min(1),
  imageUrls: z.array(z.string()).min(1, 'Suba al menos una imagen.'),
  mapUrl: z.string().optional(),
});

type LotFormValues = z.infer<typeof formSchema>;

export function LotForm({ isOpen, onOpenChange, lot, defaultType = 'Lote' }: { isOpen: boolean, onOpenChange: (o: boolean) => void, lot?: Lot | null, defaultType?: 'Lote' | 'Quinta' }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!lot;
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const widgetRef = React.useRef<any>(null);

  const form = useForm<LotFormValues>({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      lotType: defaultType,
      currency: 'CRC',
      imageUrls: []
    }
  });

  const values = form.watch();
  
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: lot?.title || '',
        description: lot?.description || '',
        lotType: lot?.lotType || defaultType,
        price: lot?.price || 0,
        currency: lot?.currency || 'CRC',
        province: lot?.province || 'San José',
        city: lot?.city || '',
        area_m2: lot?.area_m2 || 0,
        topography: lot?.topography || 'Plana',
        features: lot?.features?.join('\n') || '',
        imageUrls: lot?.imageUrls || [],
        mapUrl: lot?.mapUrl || '',
      });
    }
  }, [lot, isOpen, form, defaultType]);

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
            const currentUrls = form.getValues('imageUrls') || [];
            form.setValue('imageUrls', [...currentUrls, result.info.secure_url]);
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
    const currentUrls = form.getValues('imageUrls');
    form.setValue('imageUrls', currentUrls.filter((_, i) => i !== index));
  };

  const handleDeletePermanent = async () => {
    if (!lot) return;
    setIsDeleting(true);
    try {
      await deleteLotPermanent(firestore, lot);
      toast({ title: 'Lote eliminado', description: 'El registro se ha borrado correctamente.' });
      setIsDeleteDialogOpen(false);
      onOpenChange(false);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el registro.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: LotFormValues) => {
    const processed = {
      ...data,
      features: data.features.split('\n').map(i => i.trim()).filter(Boolean),
    };

    try {
      if (isEditing && lot) {
        await updateLot(firestore, lot.id, processed);
        toast({ title: '¡Actualizado!', description: 'El registro se ha modificado correctamente.' });
      } else {
        await addLot(firestore, processed);
        toast({ title: '¡Creado!', description: 'El nuevo terreno ha sido agregado.' });
      }
      onOpenChange(false);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la información.' });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange} modal={false}>
        <SheetContent 
          className="sm:max-w-2xl overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>
              {isEditing ? 'Editar Registro' : `Nuevo ${form.watch('lotType') || defaultType}`}
            </SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Título</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="lotType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="Lote">Lote</SelectItem>
                                  <SelectItem value="Quinta">Quinta</SelectItem>
                              </SelectContent>
                          </Select>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{`Precio (${currencySymbol(form.watch('currency'))})`}</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="currency" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="CRC">Colones (₡)</SelectItem>
                                  <SelectItem value="USD">Dólares ($)</SelectItem>
                              </SelectContent>
                          </Select>
                        <FormMessage />
                      </FormItem>
                  )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="area_m2" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área m²</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="topography" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topografía</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="province" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  {["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                              </SelectContent>
                          </Select>
                        <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="features" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Características (una por línea)</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />

              <div className="space-y-4">
                <FormLabel>Galería de Imágenes</FormLabel>
                <div className="flex flex-wrap gap-3 mb-2">
                  {values.imageUrls?.map((url, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 shadow-sm">
                      <Image src={url} alt={`img-${idx}`} fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)} 
                        className="absolute top-0 right-0 bg-destructive text-white p-1 rounded-bl-lg hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button 
                  type="button" 
                  onClick={openWidget} 
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white font-semibold"
                >
                  <ImagePlus className="mr-2 h-4 w-4" /> Subir Fotos
                </Button>
              </div>

              <FormField control={form.control} name="mapUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps (Insertar mapa)</FormLabel>
                    <FormControl><Input {...field} placeholder="Pegue aquí el enlace src o el código iframe completo" /></FormControl>
                    <FormDescription>Tip: Para mejores resultados, pega el código de "Insertar un mapa" de Google Maps.</FormDescription>
                    <FormMessage />
                  </FormItem>
              )} />

              <SheetFooter className="pt-4 flex flex-col gap-4">
                <Button type="submit" className="w-full">Guardar Cambios</Button>
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="w-full bg-red-600 hover:bg-red-700 mt-2"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar Lote
                  </Button>
                )}
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              ¿Eliminar lote?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el registro de <strong>{lot?.title}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeletePermanent();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
