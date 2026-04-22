'use server';

import type { Property, Lot } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// URL de tu Google Apps Script vinculada
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw1y643gJYCqmov2tRyEO3paVzj_faroSVrT1UsUFX9EYYhA3G9MXkEu7p3pXogJSjw/exec';

// Inicialización de Firebase en el servidor
function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

/**
 * Envía un correo electrónico utilizando Google Apps Script como puente.
 */
async function sendEmailViaGAS(to: string, subject: string, html: string) {
    try {
        const response = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify({ to, subject, html }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result.result === 'success';
    } catch (error) {
        console.error("Error al llamar a Google Apps Script:", error);
        return false;
    }
}

export async function getProperties(): Promise<Property[]> {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const col = collection(db, 'properties');
        const snap = await getDocs(col);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
    }
}

export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const ref = doc(db, 'properties', id);
        const snap = await getDoc(ref);
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Property) : null;
    } catch (error) {
        console.error("Error fetching property by id:", error);
        return null;
    }
}

export async function getLots(): Promise<Lot[]> {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const col = collection(db, 'lots');
        const snap = await getDocs(col);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Lot));
    } catch (error) {
        console.error("Error fetching lots:", error);
        return [];
    }
}

export async function getLotById(id: string): Promise<Lot | null> {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const ref = doc(db, 'lots', id);
        const snap = await getDoc(ref);
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Lot) : null;
    } catch (error) {
        console.error("Error fetching lot by id:", error);
        return null;
    }
}

/**
 * Notifica la venta de una propiedad enviando un correo mediante GAS.
 */
export async function notifyPropertySale(data: {
    title: string;
    type: string;
    city: string;
    province: string;
    price: number;
    salePrice: number;
    saleDate: string;
}) {
    const formattedSalePrice = new Intl.NumberFormat('es-CR', { 
        style: 'currency', 
        currency: 'CRC', 
        minimumFractionDigits: 0 
    }).format(data.salePrice);

    // Formatear fecha de YYYY-MM-DD a DD/MM/YYYY para el correo
    const formattedDate = data.saleDate.split('-').reverse().join('/');

    const subject = `✅ Propiedad Vendida - ${data.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">Registro de Cierre Exitoso</h2>
        <p style="font-size: 16px;">Se ha registrado la venta de la siguiente propiedad:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Propiedad:</strong> ${data.title}</p>
          <p style="margin: 5px 0;"><strong>Tipo:</strong> ${data.type}</p>
          <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${data.city}, ${data.province}</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
          <p style="font-size: 18px; margin: 5px 0;"><strong>Monto de Cierre:</strong> <span style="color: #16a34a;">${formattedSalePrice}</span></p>
          <p style="margin: 5px 0;"><strong>Fecha de la Venta:</strong> ${formattedDate}</p>
        </div>
        <p style="margin-top: 25px; font-size: 12px; color: #666; text-align: center;">
          Mensaje automático de ZB Propiedades Admin - ${new Date().toLocaleDateString('es-CR')}
        </p>
      </div>
    `;

    const success = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success };
}

/**
 * Notifica la eliminación de una propiedad mediante GAS.
 */
export async function notifyPropertyDeletion(data: {
    title: string;
    type: string;
    city: string;
    province: string;
    price: number;
}) {
    const formattedPrice = new Intl.NumberFormat('es-CR', { 
        style: 'currency', 
        currency: 'CRC', 
        minimumFractionDigits: 0 
    }).format(data.price);

    const subject = `🗑️ Propiedad Eliminada - ${data.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Registro Eliminado</h2>
        <p style="font-size: 16px;">Se ha removido permanentemente el siguiente registro del sistema:</p>
        <div style="background-color: #fdf2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 5px 0;"><strong>Propiedad:</strong> ${data.title}</p>
          <p style="margin: 5px 0;"><strong>Tipo:</strong> ${data.type}</p>
          <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${data.city}, ${data.province}</p>
          <p style="margin: 5px 0;"><strong>Precio original:</strong> ${formattedPrice}</p>
        </div>
        <p style="margin-top: 25px; font-size: 12px; color: #666; text-align: center;">
          Notificación de seguridad - Panel ZB Admin - ${new Date().toLocaleDateString('es-CR')}
        </p>
      </div>
    `;

    const success = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success };
}
