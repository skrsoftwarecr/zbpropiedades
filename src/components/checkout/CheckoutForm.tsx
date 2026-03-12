'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { placeOrder } from '@/lib/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload } from 'lucide-react';


const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }),
  email: z.string().email('El correo electrónico no es válido.'),
  phone: z.string().min(8, { message: 'Un número de teléfono válido es requerido.' }),
  address: z.string().min(5, { message: 'La dirección es requerida.' }),
  city: z.string().min(2, { message: 'La ciudad es requerida.' }),
  zip: z.string().min(4, { message: 'Un código postal válido es requerido.' }),
  paymentMethod: z.enum(['credit-card', 'paypal', 'transfer'], { required_error: 'Por favor seleccione un método de pago.' }),
  receipt: z.any().optional(),
}).refine(data => {
    if (data.paymentMethod === 'transfer' && (!data.receipt || data.receipt.length === 0)) {
        return false;
    }
    return true;
}, {
    message: 'Se requiere un comprobante de pago para este método.',
    path: ['receipt'],
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export function CheckoutForm() {
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '', email: '', phone: '', address: '', city: '', zip: '', paymentMethod: 'credit-card',
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(price);
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal * 1.13; // with 13% tax

  const onSubmit = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    let receiptPayload: { base64: string; mimeType: string; fileName: string } | undefined = undefined;

    if (values.paymentMethod === 'transfer' && values.receipt?.[0]) {
      const file = values.receipt[0];
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = error => reject(error);
        });
        receiptPayload = {
          base64: base64,
          mimeType: file.type,
          fileName: file.name
        };
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo procesar el archivo del comprobante.' });
        setIsSubmitting(false);
        return;
      }
    }
    
    // Omit the 'receipt' FileList from the values passed to the server action
    const { receipt, ...serializableValues } = values;

    const result = await placeOrder({
      ...serializableValues,
      cart,
      receipt: receiptPayload,
    });

    if (result.success) {
      toast({
        title: '¡Orden Realizada!',
        description: `Su orden #${result.orderId} ha sido realizada con éxito. Recibirá una confirmación por correo.`,
      });
      clearCart();
      router.push('/');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message || 'Error al realizar la orden.' });
    }
    setIsSubmitting(false);
  };


  const handleNext = async (fieldNames: (keyof CheckoutFormValues)[]) => {
    const isValid = await form.trigger(fieldNames);
    if (isValid) {
        if (activeTab === 'personal') setActiveTab('delivery');
        else if (activeTab === 'delivery') setActiveTab('payment');
        else if (activeTab === 'payment') setActiveTab('summary');
    }
  };

  if (cart.length === 0 && !form.formState.isSubmitSuccessful) {
    return (
        <Card>
            <CardContent className="p-10 text-center">
                <p>Su carrito está vacío. Por favor agregue artículos antes de pagar.</p>
                <Button asChild className="mt-4"><Link href="/parts">Ir a Comprar</Link></Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="delivery">Envío</TabsTrigger>
            <TabsTrigger value="payment">Pago</TabsTrigger>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
          </TabsList>

          <Card className="mt-4">
            <CardContent className="p-6">
                <TabsContent value="personal" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Información Personal</h3>
                    <div className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Correo Electrónico</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <Button type="button" onClick={() => handleNext(['name', 'email', 'phone'])} className="mt-6 w-full">Siguiente</Button>
                </TabsContent>

                <TabsContent value="delivery" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Información de Envío</h3>
                    <div className="space-y-4">
                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="zip" render={({ field }) => ( <FormItem><FormLabel>Código Postal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <Button type="button" onClick={() => handleNext(['address', 'city', 'zip'])} className="mt-6 w-full">Siguiente</Button>
                </TabsContent>

                <TabsContent value="payment" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Método de Pago</h3>
                    <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="credit-card" /></FormControl><FormLabel className="font-normal">Tarjeta de Crédito</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="paypal" /></FormControl><FormLabel className="font-normal">PayPal</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="transfer" /></FormControl><FormLabel className="font-normal">Transferencia / SINPE Móvil</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    {form.watch('paymentMethod') === 'transfer' && (
                       <div className="p-4 border-dashed border-2 rounded-md mt-4 bg-muted/50">
                        <FormField
                            control={form.control}
                            name="receipt"
                            render={({ field: { onChange, onBlur, name, ref } }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-base flex items-center gap-2"><Upload className="h-5 w-5" /> Adjuntar Comprobante de Pago</FormLabel>
                                <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onBlur={onBlur}
                                    name={name}
                                    onChange={(e) => onChange(e.target.files)}
                                    ref={ref}
                                    className="file:font-semibold file:text-primary file:bg-primary/10 hover:file:bg-primary/20 cursor-pointer"
                                />
                                </FormControl>
                                <FormDescription>
                                    Por favor, adjunte una captura de pantalla o PDF del SINPE Móvil o la transferencia bancaria.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                       </div>
                    )}
                    <Button type="button" onClick={() => handleNext(['paymentMethod', 'receipt'])} className="mt-6 w-full">Revisar Orden</Button>
                </TabsContent>

                <TabsContent value="summary" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Resumen de la Orden</h3>
                    <div className="space-y-2 text-sm">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-semibold pt-2 border-t">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                     <Button type="submit" size="lg" className="w-full mt-6" disabled={isSubmitting}>
                        {isSubmitting ? 'Realizando Orden...' : 'Realizar Orden'}
                    </Button>
                </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </form>
    </Form>
  );
}
