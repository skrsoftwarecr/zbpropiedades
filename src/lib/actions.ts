'use server';

import type { Property, Lot } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw1y643gJYCqmov2tRyEO3paVzj_faroSVrT1UsUFX9EYYhA3G9MXkEu7p3pXogJSjw/exec';

function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

/**
 * Envía un correo electrónico utilizando Google Apps Script como puente.
 * IMPORTANTE: Se añade redirect: 'follow' para manejar el comportamiento de GAS.
 */
async function sendEmailViaGAS(to: string, subject: string, html: string) {
    console.log(`--- INICIANDO ENVÍO DE CORREO A: ${to} ---`);
    console.log(`Asunto: ${subject}`);
    
    try {
        const response = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify({ to, subject, html }),
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // OBLIGATORIO para Google Apps Script
        });

        const result = await response.json();
        console.log('Respuesta de Google Apps Script:', result);

        if (result.result === 'success') {
            console.log('✅ Correo enviado exitosamente vía GAS.');
            return true;
        } else {
            console.error('❌ Error devuelto por GAS:', result.error);
            return false;
        }
    } catch (error) {
        console.error("❌ Fallo crítico al llamar a Google Apps Script:", error);
        return false;
    }
}

/**
 * Registra un documento en la colección 'mail' para persistencia y logs.
 */
async function logEmailInFirestore(to: string, subject: string, html: string) {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        await addDoc(collection(db, 'mail'), {
            to,
            message: {
                subject,
                html,
            },
            delivery: {
                startTime: serverTimestamp(),
                state: 'pending'
            },
            createdAt: serverTimestamp()
        });
        console.log('✅ Registro de correo creado en colección "mail".');
    } catch (error) {
        console.error('❌ Error al escribir en colección "mail":', error);
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
        return null;
    }
}

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

    const formattedDate = data.saleDate.split('-').reverse().join('/');
    const subject = `✅ Propiedad Vendida - ${data.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #16a34a;">Registro de Cierre Exitoso</h2>
        <p>Se ha registrado la venta de la siguiente propiedad:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p><strong>Propiedad:</strong> ${data.title}</p>
          <p><strong>Tipo:</strong> ${data.type}</p>
          <p><strong>Ubicación:</strong> ${data.city}, ${data.province}</p>
          <hr />
          <p style="font-size: 18px;"><strong>Monto de Cierre:</strong> ${formattedSalePrice}</p>
          <p><strong>Fecha de la Venta:</strong> ${formattedDate}</p>
        </div>
      </div>
    `;

    // 1. Intentar envío inmediato vía GAS
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    
    // 2. Registrar en la colección 'mail' (para trigger email o logs)
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);

    return { success: sent };
}

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
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #dc2626;">Registro Eliminado</h2>
        <p>Se ha removido el siguiente registro:</p>
        <div style="background-color: #fdf2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <p><strong>Propiedad:</strong> ${data.title}</p>
          <p><strong>Tipo:</strong> ${data.type}</p>
          <p><strong>Ubicación:</strong> ${data.city}, ${data.province}</p>
          <p><strong>Precio original:</strong> ${formattedPrice}</p>
        </div>
      </div>
    `;

    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);

    return { success: sent };
}
