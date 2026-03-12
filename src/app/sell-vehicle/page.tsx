'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Handshake } from 'lucide-react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);
  
const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }),
  phone: z.string().min(8, { message: 'Un número de teléfono válido es requerido.' }),
  brand: z.string().min(2, { message: 'La marca es requerida.' }),
  model: z.string().min(1, { message: 'El modelo es requerido.' }),
  year: z.coerce.number().int().min(1950, 'El año no es válido.').max(new Date().getFullYear() + 1, 'El año no puede ser en el futuro.'),
  condition: z.enum(['Bueno', 'Regular', 'Dañado']),
  damages: z.string().optional(),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
});

type SellVehicleFormValues = z.infer<typeof formSchema>;

export default function SellVehiclePage() {
  const { toast } = useToast();
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const phoneNumbers = ['50687216913', '50670210104', '50671733091'];
    const randomIndex = Math.floor(Math.random() * phoneNumbers.length);
    setWhatsappNumber(phoneNumbers[randomIndex]);
  }, []);

  const form = useForm<SellVehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      condition: 'Bueno',
      damages: '',
      price: 0,
    },
  });

  const onSubmit = (values: SellVehicleFormValues) => {
    const message = `
¡Hola! Quisiera vender mi vehículo. Aquí están los detalles:
----------------------------------
*Vendedor:* ${values.name}
*Teléfono:* ${values.phone}
----------------------------------
*Marca:* ${values.brand}
*Modelo:* ${values.model}
*Año:* ${values.year}
*Estado:* ${values.condition}
*Precio solicitado:* ₡${values.price.toLocaleString('es-CR')}
*Detalles de daños:* ${values.damages || 'No especificados'}
----------------------------------
Espero su contacto para negociar. ¡Gracias!
    `.trim().replace(/\s+/g, ' ');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    
    toast({
        title: '¡Listo para negociar!',
        description: 'Se está abriendo WhatsApp para que envíes la información de tu vehículo.',
    });

    form.reset();
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
       <div className="text-center mb-12">
        <Handshake className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl md:text-5xl font-bold font-headline">Vende tu Vehículo con Nosotros</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          ¿Tienes un BMW o vehículo europeo que quieres vender? Te ofrecemos un precio justo y un proceso rápido y seguro. Completa el formulario para iniciar.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Detalles del Vehículo</CardTitle>
                <CardDescription>Completa la información a continuación. Un asesor te contactará por WhatsApp para continuar con el proceso.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Tu Nombre Completo</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Tu Teléfono (WhatsApp)</FormLabel><FormControl><Input placeholder="8888-8888" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="brand" render={({ field }) => ( <FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="BMW, Audi, VW..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="model" render={({ field }) => ( <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input placeholder="M3, A4, Golf..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="year" render={({ field }) => ( <FormItem><FormLabel>Año</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="price" render={({ field }) => ( <FormItem><FormLabel>Precio Solicitado (CRC)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>

                    <FormField control={form.control} name="condition" render={({ field }) => (
                        <FormItem><FormLabel>Estado General</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                            <SelectItem value="Bueno">Bueno (Sin daños mayores, funcional)</SelectItem>
                            <SelectItem value="Regular">Regular (Detalles estéticos o mecánicos menores)</SelectItem>
                            <SelectItem value="Dañado">Dañado (Requiere reparaciones importantes)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )} />

                    {form.watch('condition') === 'Dañado' && (
                        <FormField control={form.control} name="damages" render={({ field }) => (
                            <FormItem><FormLabel>Describa los daños</FormLabel><FormControl><Textarea placeholder="Ej: Falla en el motor, golpe en la puerta derecha, etc." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    )}

                    <Button type="submit" size="lg" className="w-full font-semibold" disabled={!whatsappNumber}>
                        <WhatsAppIcon className="mr-2 h-5 w-5" />
                        {form.formState.isSubmitting ? 'Generando mensaje...' : 'Enviar para Vender por WhatsApp'}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
