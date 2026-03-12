'use server';

import type { CartItem } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// The data fetching functions are temporarily modified to return empty arrays.
// The data will now be fetched directly from Firestore on the client-side.
// This will be fully replaced in a future step.
export async function getProducts(filters: { [key: string]: any } = {}): Promise<any[]> {
  return [];
}

export async function getProductById(id: string): Promise<any | undefined> {
  return undefined;
}

export async function getFeaturedProducts(): Promise<any[]> {
  return [];
}

export async function getVehicles(filters: { [key: string]: any } = {}): Promise<any[]> {
  return [];
}

export async function getVehicleById(id: string): Promise<any | undefined> {
  return undefined;
}

export async function getFeaturedVehicles(): Promise<any[]> {
  return [];
}


// Mock action for form submission
export async function scheduleInspection(formData: FormData) {
    const data = {
        vehicleId: formData.get('vehicleId'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        preferredDate: formData.get('preferredDate'),
        message: formData.get('message'),
    };
    
    console.log('--- Cita de Inspección Agendada ---');
    console.log(data);
    await delay(1000);

    // In a real app, this would save to Firestore 'citas' collection
    return { success: true, message: 'Cita agendada con éxito!' };
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

    if (!url || !url.startsWith('https')) {
        console.error('APPS_SCRIPT_URL no está configurada correctamente en .env.local');
        return { success: false, message: 'El servidor no está configurado para procesar pedidos. Contacte a soporte.' };
    }

    try {
        const payload = {
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            zip: orderData.zip,
            paymentMethod: orderData.paymentMethod,
            cart: orderData.cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
            receipt: orderData.receipt,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            redirect: 'follow'
        });
        
        // Handle cases where the response is not ok (e.g. 500 internal server error from Apps Script)
        if (!response.ok) {
            throw new Error(`Error from Apps Script server: ${response.statusText}`);
        }
        
        const result = await response.json();

        if (result.success) {
            return { success: true, message: 'Orden realizada con éxito!', orderId: result.orderId };
        } else {
            console.error("Error from Apps Script:", result.error);
            return { success: false, message: 'Hubo un error al contactar el servicio de pedidos.' };
        }

    } catch (error) {
        console.error('Error in placeOrder action:', error);
        return { success: false, message: 'No se pudo conectar con el servicio de pedidos.' };
    }
}
