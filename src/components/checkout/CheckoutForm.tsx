'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { placeOrder } from '@/lib/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email(),
  phone: z.string().min(10, { message: 'A valid phone number is required.' }),
  address: z.string().min(5, { message: 'Address is required.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  zip: z.string().min(5, { message: 'A valid ZIP code is required.' }),
  paymentMethod: z.enum(['credit-card', 'paypal'], { required_error: 'Please select a payment method.' }),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export function CheckoutForm() {
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '', email: '', phone: '', address: '', city: '', zip: '', paymentMethod: 'credit-card',
    },
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal * 1.07; // with 7% tax

  const onSubmit = async (values: CheckoutFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('cart', JSON.stringify(cart));

    const result = await placeOrder(formData);
    if (result.success) {
      toast({
        title: 'Order Placed!',
        description: `Your order #${result.orderId} has been successfully placed.`,
      });
      clearCart();
      router.push('/');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to place order.' });
    }
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
                <p>Your cart is empty. Please add items before checking out.</p>
                <Button asChild className="mt-4"><Link href="/parts">Go Shopping</Link></Button>
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
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <Card className="mt-4">
            <CardContent className="p-6">
                <TabsContent value="personal" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <Button type="button" onClick={() => handleNext(['name', 'email', 'phone'])} className="mt-6 w-full">Next</Button>
                </TabsContent>

                <TabsContent value="delivery" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                    <div className="space-y-4">
                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="zip" render={({ field }) => ( <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <Button type="button" onClick={() => handleNext(['address', 'city', 'zip'])} className="mt-6 w-full">Next</Button>
                </TabsContent>

                <TabsContent value="payment" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                    <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="credit-card" /></FormControl><FormLabel className="font-normal">Credit Card</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="paypal" /></FormControl><FormLabel className="font-normal">PayPal</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="button" onClick={() => handleNext(['paymentMethod'])} className="mt-6 w-full">Review Order</Button>
                </TabsContent>

                <TabsContent value="summary" className="mt-0">
                    <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-semibold pt-2 border-t">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                     <Button type="submit" size="lg" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </Button>
                </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </form>
    </Form>
  );
}
