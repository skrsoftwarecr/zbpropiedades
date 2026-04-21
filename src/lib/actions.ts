
'use server';

import type { Property, Lot } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Server-side firebase initialization
function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
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
 * Notifica la venta de una propiedad enviando un documento a la colección 'mail'
 * (Compatible con la extensión Firebase Trigger Email).
 */
export async function notifyPropertySale(data: {
    title: string;
    type: string;
    city: string;
    price: number;
    date: Date;
}) {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        
        const formattedPrice = new Intl.NumberFormat('es-CR', { 
            style: 'currency', 
            currency: 'CRC', 
            minimumFractionDigits: 0 
        }).format(data.price);

        const formattedDate = data.date.toLocaleDateString('es-CR');

        await addDoc(collection(db, 'mail'), {
            to: 'skrsoftwarecr@gmail.com',
            message: {
                subject: `✅ Propiedad Vendida - ${data.title}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #2563eb;">Registro de Venta Exitosa</h2>
                        <p>Se ha registrado el cierre de una propiedad en el sistema:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>Propiedad:</strong> ${data.title}</li>
                            <li><strong>Tipo:</strong> ${data.type}</li>
                            <li><strong>Ubicación:</strong> ${data.city}</li>
                            <li><strong>Monto de Cierre:</strong> ${formattedPrice}</li>
                            <li><strong>Fecha de Venta:</strong> ${formattedDate}</li>
                        </ul>
                        <p style="margin-top: 20px; font-size: 12px; color: #666;">
                            Este es un mensaje automático del sistema administrativo de ZB Propiedades.
                        </p>
                    </div>
                `,
            },
            createdAt: serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        console.error("Error sending sale notification:", error);
        return { success: false, message: 'No se pudo enviar la notificación.' };
    }
}
