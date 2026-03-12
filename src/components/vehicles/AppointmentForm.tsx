'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useFirestore } from '@/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { sendAppointmentEmail } from '@/lib/actions';
import { addAppointment } from '@/lib/firestore-service';
import { Card, CardContent } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { Skeleton } from '../ui/skeleton';


const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor ingrese un correo electrónico válido.' }),
  phone: z.string().min(8, { message: 'Por favor ingrese un número de teléfono válido.' }),
  preferredDate: z.date({
    required_error: "Se requiere una fecha.",
  }),
  message: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  vehicleId: string;
}

export function AppointmentForm({ vehicleId }: AppointmentFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values: AppointmentFormValues) => {
    const appointmentData = {
        ...values,
        vehicleId,
        status: 'Pending' as const,
    }

    try {
        // 1. Save to Firestore client-side
        addAppointment(firestore, appointmentData);

        // 2. Trigger server action to send email
        const result = await sendAppointmentEmail(appointmentData);

        if (result.success) {
            toast({
                title: 'Cita Solicitada',
                description: 'Hemos recibido su solicitud y le contactaremos pronto para confirmar.',
            });
            form.reset();
        } else {
             throw new Error(result.message || 'Error al enviar el correo de la cita.');
        }

    } catch (error) {
        console.error("Error submitting appointment:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Hubo un problema al enviar su solicitud. Por favor, inténtelo de nuevo.',
        });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                        <Input placeholder="usted@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="8888-8888" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha Preferida</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && isClient ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {isClient ? <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                        initialFocus
                        locale={es}
                      /> : <div className="w-[280px] h-[311px] p-3"><Skeleton className="h-full w-full" /></div>}
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="¿Alguna pregunta o momentos específicos en que esté disponible?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Enviando...' : 'Solicitar Cita'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    