'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { addProduct, updateProduct } from '@/lib/firestore-service';
import type { Product } from '@/lib/types';

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
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  sku: z.string().min(1, 'El SKU es requerido.'),
  category: z.enum(['Original', 'Aftermarket']),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo.'),
  condition: z.enum(['Nuevo', 'Usado']),
  description: z.string().min(10, 'La descripción es muy corta.'),
  compatibility: z.string().min(1, 'Agregue al menos un modelo compatible.'),
  imageUrls: z.string()
    .min(1, 'Agregue al menos una URL de imagen.')
    .refine(value => {
        const urls = value.split('\n').map(item => item.trim()).filter(Boolean);
        if (urls.length === 0) return false;
        return urls.every(url => z.string().url({ message: `La URL '${url.slice(0,30)}...' no es válida.` }).safeParse(url).success);
    }, 'Una o más URLs no son válidas. Asegúrese de que cada línea contenga una URL completa (ej: https://...).'),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product?: Product | null;
}

export function ProductForm({
  isOpen,
  onOpenChange,
  product,
}: ProductFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      category: product?.category || 'Aftermarket',
      price: product?.price || 0,
      stock: product?.stock || 0,
      condition: product?.condition || 'Nuevo',
      description: product?.description || '',
      compatibility: product?.compatibility.join('\n') || '',
      imageUrls: product?.imageUrls.join('\n') || '',
    },
  });
  
  // Reset form when the product to edit changes
  React.useEffect(() => {
    if (isOpen) {
        form.reset({
            name: product?.name || '',
            sku: product?.sku || '',
            category: product?.category || 'Aftermarket',
            price: product?.price || 0,
            stock: product?.stock || 0,
            condition: product?.condition || 'Nuevo',
            description: product?.description || '',
            compatibility: product?.compatibility.join('\n') || '',
            imageUrls: product?.imageUrls.join('\n') || '',
        });
    }
  }, [product, isOpen, form]);

  const onSubmit = async (data: ProductFormValues) => {
    const processedData = {
      ...data,
      compatibility: data.compatibility.split('\n').map(item => item.trim()).filter(Boolean),
      imageUrls: data.imageUrls.split('\n').map(item => item.trim()).filter(Boolean),
    };

    try {
      if (isEditing && product) {
        updateProduct(firestore, product.id, processedData);
        toast({ title: '¡Éxito!', description: 'Repuesto actualizado correctamente.' });
      } else {
        addProduct(firestore, processedData);
        toast({ title: '¡Éxito!', description: 'Repuesto agregado correctamente.' });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el repuesto. Verifique los permisos.',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar Repuesto' : 'Agregar Nuevo Repuesto'}</SheetTitle>
          <SheetDescription>
            {isEditing ? 'Modifique los detalles del repuesto.' : 'Complete los detalles del nuevo repuesto.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem><FormLabel>SKU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Precio (CRC)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="Original">Original</SelectItem>
                    <SelectItem value="Aftermarket">Aftermarket</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="condition" render={({ field }) => (
                <FormItem>
                <FormLabel>Condición</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="Nuevo">Nuevo</SelectItem>
                    <SelectItem value="Usado">Usado</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="compatibility" render={({ field }) => (
                <FormItem><FormLabel>Compatibilidad (uno por línea)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="imageUrls" render={({ field }) => (
                <FormItem><FormLabel>URLs de Imagen (uno por línea)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <SheetFooter className="pt-4">
                <SheetClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
                </SheetClose>
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
