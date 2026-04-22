'use server';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// URL exacta de tu Web App desplegada en Google Apps Script
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw1y643gJYCqmov2tRyEO3paVzj_faroSVrT1UsUFX9EYYhA3G9MXkEu7p3pXogJSjw/exec';

function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

/**
 * Envía un correo electrónico utilizando Google Apps Script como puente.
 * IMPORTANTE: Usa redirect: 'follow' porque Google siempre redirecciona las peticiones de macros.
 */
async function sendEmailViaGAS(to: string, subject: string, html: string) {
    console.log(`--- INICIANDO ENVÍO GAS ---`);
    console.log(`Destinatario: ${to}`);
    console.log(`Asunto: ${subject}`);
    
    try {
        const response = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify({ to, subject, html }),
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow', // OBLIGATORIO para evitar errores de redirección de Google
        });

        if (!response.ok) {
            console.error(`❌ HTTP Error en GAS: ${response.status} ${response.statusText}`);
            return false;
        }

        const result = await response.json();
        console.log('✅ Respuesta de Google:', result);
        return result.result === 'success';
    } catch (error) {
        console.error("❌ Fallo crítico en la comunicación con GAS:", error);
        return false;
    }
}

/**
 * Registra un documento en la colección 'mail' para auditoría y compatibilidad con Trigger Email Extension.
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
            createdAt: serverTimestamp()
        });
        console.log('✅ Copia del correo registrada en Firestore (colección "mail")');
    } catch (error) {
        console.error('❌ Error al escribir auditoría en Firestore:', error);
    }
}

/**
 * Notificación de Venta de Propiedad
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
    const formattedPrice = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(data.salePrice);
    const subject = `✅ Propiedad Vendida - ${data.title}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">¡Venta Registrada!</h2>
        <p style="font-size: 16px;">Se ha marcado una propiedad como vendida en el sistema:</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px;">
            <p><b>Propiedad:</b> ${data.title}</p>
            <p><b>Tipo:</b> ${data.type}</p>
            <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
            <p style="font-size: 18px; color: #1e293b;"><b>Monto de cierre:</b> <span style="color: #16a34a;">${formattedPrice}</span></p>
            <p><b>Fecha de la transacción:</b> ${data.saleDate}</p>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Este es un mensaje automático del sistema administrativo de ZB Propiedades.</p>
      </div>
    `;
    
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

/**
 * Notificación de Venta de Lote/Quinta
 */
export async function notifyLotSale(data: {
    title: string;
    lotType: string;
    city: string;
    province: string;
    price: number;
    salePrice: number;
    saleDate: string;
}) {
    const formattedPrice = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(data.salePrice);
    const subject = `✅ Lote/Quinta Vendido - ${data.title}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">¡Terreno Vendido!</h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px;">
            <p><b>Título:</b> ${data.title}</p>
            <p><b>Categoría:</b> ${data.lotType}</p>
            <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
            <p style="font-size: 18px;"><b>Monto de venta:</b> <span style="color: #16a34a;">${formattedPrice}</span></p>
            <p><b>Fecha de venta:</b> ${data.saleDate}</p>
        </div>
      </div>
    `;
    
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

/**
 * Notificación de Eliminación de Propiedad
 */
export async function notifyPropertyDeletion(data: { title: string; type: string; city: string; province: string; price: number }) {
    const subject = `🗑️ Propiedad Eliminada - ${data.title}`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #fee2e2; border-radius: 8px;">
            <h2 style="color: #dc2626;">Registro Eliminado</h2>
            <p>Se ha removido permanentemente el siguiente registro del sistema:</p>
            <ul>
                <li><b>Título:</b> ${data.title}</li>
                <li><b>Tipo:</b> ${data.type}</li>
                <li><b>Ubicación:</b> ${data.city}, ${data.province}</li>
            </ul>
        </div>
    `;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

/**
 * Notificación de Eliminación de Lote
 */
export async function notifyLotDeletion(data: { title: string; lotType: string; city: string; province: string; price: number }) {
    const subject = `🗑️ Lote Eliminado - ${data.title}`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #fee2e2; border-radius: 8px;">
            <h2 style="color: #dc2626;">Terreno Eliminado</h2>
            <p>Se ha eliminado el lote:</p>
            <p><b>Título:</b> ${data.title}</p>
            <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
        </div>
    `;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}
