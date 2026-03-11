'use server';

import { products, vehicles } from './data';
import type { Product, Vehicle } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(filters: { [key: string]: any } = {}): Promise<Product[]> {
  await delay(300);
  // In a real app, you'd filter this on the database query
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(200);
  return products.find(p => p.id === id);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(100);
  return products.slice(0, 4);
}

export async function getVehicles(filters: { [key: string]: any } = {}): Promise<Vehicle[]> {
  await delay(300);
  // In a real app, you'd filter this on the database query
  return vehicles;
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  await delay(200);
  return vehicles.find(v => v.id === id);
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  await delay(100);
  return vehicles.slice(0, 3);
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

export async function placeOrder(formData: FormData) {
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        zip: formData.get('zip'),
        paymentMethod: formData.get('paymentMethod'),
        cart: formData.get('cart'),
    };
    
    console.log('--- Orden Realizada ---');
    console.log(data);
    await delay(1500);

    // In a real app, this would save to Firestore 'pedidos' collection
    return { success: true, message: 'Orden realizada con éxito!', orderId: `BMCR-${Date.now()}` };
}
