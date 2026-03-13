'use server';

import type { CartItem, Product, Vehicle } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Server-side firebase initialization for actions
function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

export async function getProductById(productId: string): Promise<Product | null> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return null;
    }
    const data = productSnap.data();
    return { 
        id: productSnap.id,
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        stock: data.stock,
        condition: data.condition,
        compatibility: data.compatibility,
        imageUrls: data.imageUrls,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as Product;
}

export async function getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    const vehicleSnap = await getDoc(vehicleRef);

    if (!vehicleSnap.exists()) {
        return null;
    }
    const data = vehicleSnap.data();
    return {
        id: vehicleSnap.id,
        make: data.make,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        vin: data.vin,
        engine: data.engine,
        transmission: data.transmission,
        exteriorColor: data.exteriorColor,
        interiorColor: data.interiorColor,
        features: data.features,
        description: data.description,
        imageUrls: data.imageUrls,
        availabilityStatus: data.availabilityStatus,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as Vehicle;
}

export async function getProducts(): Promise<Product[]> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id,
            name: data.name,
            category: data.category,
            price: data.price,
            description: data.description,
            stock: data.stock,
            condition: data.condition,
            compatibility: data.compatibility,
            imageUrls: data.imageUrls,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as Product
    });
    return productList;
}

export async function getVehicles(): Promise<Vehicle[]> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const vehiclesCol = collection(db, 'vehicles');
    const vehicleSnapshot = await getDocs(vehiclesCol);
    const vehicleList = vehicleSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            vin: data.vin,
            engine: data.engine,
            transmission: data.transmission,
            exteriorColor: data.exteriorColor,
            interiorColor: data.interiorColor,
            features: data.features,
            description: data.description,
            imageUrls: data.imageUrls,
            availabilityStatus: data.availabilityStatus,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as Vehicle
    });
    return vehicleList;
}


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
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error from Apps Script server: ${response.status} ${response.statusText}. Body: ${errorText}`);
        }
        
        const responseText = await response.text();
        try {
            const result = JSON.parse(responseText);
            return result.success ? { success: true } : { success: false, message: 'Error from email service.' };
        } catch (jsonError) {
            // The service might return a non-JSON success response. If status is ok, we assume success.
            console.warn('Response from email service was not valid JSON, but status was OK. Assuming success.', responseText);
            return { success: true };
        }

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
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error from Apps Script server: ${response.statusText}. Body: ${errorBody}`);
        }
        
        const responseText = await response.text();
        try {
            const result = JSON.parse(responseText);
            if (result.success) {
                return { success: true, message: '¡Orden realizada con éxito!', orderId: result.orderId };
            } else {
                console.error("Error from Apps Script:", result.error);
                return { success: false, message: result.error || 'Hubo un error al contactar el servicio de pedidos.' };
            }
        } catch (jsonError) {
            // The service might return a non-JSON success response. If status is ok, we assume success.
            console.warn('Response from order service was not valid JSON, but status was OK. Assuming success.', responseText);
            // We can't return a real orderId here, so we'll return a placeholder.
            return { success: true, message: '¡Orden realizada con éxito!', orderId: 'procesando' };
        }

    } catch (error) {
        console.error('Error in placeOrder action:', error);
        return { success: false, message: 'No se pudo conectar con el servicio de pedidos.' };
    }
}
