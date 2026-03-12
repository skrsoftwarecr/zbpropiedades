'use server';

import type { CartItem } from './types';

interface AppointmentEmailData {
    vehicleId: string;
    name: string;
    email: string;
    phone: string;
    preferredDate: Date;
    message?: string;
}

export async function sendAppointmentEmail(appointmentData: AppointmentEmailData) {
    const url = process.env.APPS_SCRIPT_URL;

    if (!url) {
        console.error('APPS_SCRIPT_URL is not set.');
        return { success: false, message: 'El servidor de correo no está configurado.' };
    }
    
    try {
        const payload = {
            ...appointmentData,
            type: 'appointment',
            preferredDate: appointmentData.preferredDate.toISOString(),
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            redirect: 'follow',
        });
        
        if (!response.ok) {
            throw new Error(`Error from Apps Script server: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        return result.success ? { success: true } : { success: false, message: 'Error from email service.' };

    } catch (error) {
        console.error('Error in sendAppointmentEmail:', error);
        return { success: false, message: 'No se pudo conectar con el servicio de correo.' };
    }
}


interface PlaceOrderArgs {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    paymentMethod: string;
    cart: CartItem[];
    receipt?: {
        base64: string;
        mimeType: string;
        fileName: string;
    };
}

export async function placeOrder(orderData: PlaceOrderArgs) {
    const url = process.env.APPS_SCRIPT_URL;

    if (!url) {
        console.error('APPS_SCRIPT_URL is not set.');
        return { success: false, message: 'El servidor de pedidos no está configurado.' };
    }

    try {
        const payload = {
            ...orderData,
            type: 'order',
            cart: orderData.cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            redirect: 'follow'
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error from Apps Script server: ${response.statusText}. Body: ${errorBody}`);
        }
        
        const result = await response.json();

        if (result.success) {
            return { success: true, message: '¡Orden realizada con éxito!', orderId: result.orderId };
        } else {
            console.error("Error from Apps Script:", result.error);
            return { success: false, message: result.error || 'Hubo un error al contactar el servicio de pedidos.' };
        }

    } catch (error) {
        console.error('Error in placeOrder action:', error);
        return { success: false, message: 'No se pudo conectar con el servicio de pedidos.' };
    }
}

    