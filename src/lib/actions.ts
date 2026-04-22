'use server';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * URL de la Web App desplegada en Google Apps Script.
 * RECUERDA: Esta URL debe ser la de tu última implementación con acceso para "Cualquiera".
 */
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzNMB6nEf0vU10rY9hRCk6Db8od-wmm1gozrPWEN92HSuuH6AWUomX_n-co2yY1VU4h/exec';

function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

/**
 * Envía un correo electrónico utilizando Google Apps Script como puente.
 * IMPORTANTE: Se usa redirect: 'follow' para manejar las redirecciones de Google.
 */
async function sendEmailViaGAS(to: string, subject: string, html: string) {
    console.log(`--- INTENTANDO ENVÍO VÍA GAS ---`);
    console.log(`Hacia: ${to}`);
    console.log(`Asunto: ${subject}`);
    
    try {
        const response = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify({ to, subject, html }),
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
        });

        if (!response.ok) {
            console.error(`❌ Error HTTP: ${response.status}`);
            return false;
        }

        const result = await response.json();
        console.log('✅ Resultado GAS:', result);
        return result.result === 'success';
    } catch (error) {
        console.error("❌ Fallo crítico en comunicación con GAS:", error);
        return false;
    }
}

/**
 * Registra un documento en la colección 'mail' para auditoría y respaldo.
 * Sigue la estructura de Firebase Trigger Email Extension.
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
        console.log('✅ Respaldo registrado en Firestore (colección "mail")');
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
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">¡Venta Registrada!</h2>
        <p style="font-size: 16px;">Se ha marcado una propiedad como vendida en el sistema:</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1;">
            <p><b>Propiedad:</b> ${data.title}</p>
            <p><b>Tipo:</b> ${data.type}</p>
            <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
            <p style="font-size: 18px; color: #1e293b; margin-top: 15px; border-top: 1px solid #e2e8f0; pt: 10px;">
              <b>Monto de cierre:</b> <span style="color: #16a34a;">${formattedPrice}</span>
            </p>
            <p><b>Fecha de la transacción:</b> ${data.saleDate}</p>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Mensaje automático del Sistema ZB Propiedades.</p>
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
    const subject = `✅ Terreno Vendido - ${data.title}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">¡Venta de Terreno Registrada!</h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1;">
            <p><b>Título:</b> ${data.title}</p>
            <p><b>Categoría:</b> ${data.lotType}</p>
            <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
            <p style="font-size: 18px; color: #1e293b; margin-top: 15px; border-top: 1px solid #e2e8f0; pt: 10px;">
              <b>Monto de venta:</b> <span style="color: #16a34a;">${formattedPrice}</span>
            </p>
            <p><b>Fecha de venta:</b> ${data.saleDate}</p>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Mensaje automático del Sistema ZB Propiedades.</p>
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
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #fee2e2; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Registro Eliminado</h2>
            <p>Se ha removido permanentemente el siguiente registro del sistema:</p>
            <div style="background-color: #fff1f2; padding: 15px; border-radius: 6px;">
                <p><b>Título:</b> ${data.title}</p>
                <p><b>Tipo:</b> ${data.type}</p>
                <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
                <p><b>Precio Publicado:</b> ₡${data.price.toLocaleString('es-CR')}</p>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Auditoría del Sistema ZB Propiedades.</p>
        </div>
    `;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

/**
 * Notificación de Eliminación de Lote/Terreno
 */
export async function notifyLotDeletion(data: { title: string; lotType: string; city: string; province: string; price: number }) {
    const subject = `🗑️ Terreno Eliminado - ${data.title}`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #fee2e2; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Terreno Eliminado</h2>
            <p>Se ha removido el lote/quinta del sistema:</p>
            <div style="background-color: #fff1f2; padding: 15px; border-radius: 6px;">
                <p><b>Título:</b> ${data.title}</p>
                <p><b>Categoría:</b> ${data.lotType}</p>
                <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
                <p><b>Precio Publicado:</b> ₡${data.price.toLocaleString('es-CR')}</p>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Auditoría del Sistema ZB Propiedades.</p>
        </div>
    `;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}
