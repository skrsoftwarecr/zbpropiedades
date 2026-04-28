'use server';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * URL de la Web App desplegada en Google Apps Script.
 */
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwIbK0IZvc7TOont320I9bvCh1SQ3TVrbol0TfSzxyIFO9wiVMjqUSo0JOea-z7taNv/exec';

function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

/**
 * Envía un correo electrónico utilizando Google Apps Script como puente.
 * Utiliza redirect: 'follow' para manejar las redirecciones internas de Google.
 */
async function sendEmailViaGAS(to: string, subject: string, html: string) {
    console.log(`--- INICIANDO ENVÍO VÍA GOOGLE SCRIPT ---`);
    console.log(`Destinatario: ${to}`);
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
            console.error(`❌ Error en la respuesta HTTP: ${response.status}`);
            return false;
        }

        const result = await response.json();
        console.log('✅ Respuesta de Google Script:', result);
        return result.result === 'success';
    } catch (error) {
        console.error("❌ Fallo en la comunicación con Google Apps Script:", error);
        return false;
    }
}

/**
 * Registra el correo en la colección 'mail' para auditoría.
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
        console.log('✅ Registro de auditoría creado en Firestore (colección "mail")');
    } catch (error) {
        console.error('❌ No se pudo guardar la auditoría en Firestore:', error);
    }
}

/**
 * Notificación de Venta de Propiedad
 */
export async function notifyPropertySale(data: {
    title: string;
    type: string;
    operationType: string;
    city: string;
    province: string;
    price: number;
    salePrice: number;
    saleDate: string;
}) {
    const isSale = data.operationType === 'Venta';
    const currencyFormatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 });
    
    const formattedListingPrice = currencyFormatter.format(data.price);
    const formattedSalePrice = currencyFormatter.format(data.salePrice);
    
    let contentHtml = '';

    if (isSale) {
        // Cálculos para Venta
        const gananciaAdmin = data.salePrice * 0.05;
        const comisionPagar = gananciaAdmin * 0.05;

        contentHtml = `
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1;">
                <p style="margin: 5px 0;"><b>Tipo de propiedad:</b> ${data.type}</p>
                <p style="margin: 5px 0;"><b>Precio de publicación:</b> ${formattedListingPrice}</p>
                <p style="margin: 5px 0; font-size: 18px; color: #1e293b;"><b>Precio de venta:</b> <span style="color: #16a34a; font-weight: bold;">${formattedSalePrice}</span></p>
                <p style="margin: 15px 0 5px 0; padding-top: 10px; border-top: 1px solid #e2e8f0;"><b>Ganancia del admin (5%):</b> ${currencyFormatter.format(gananciaAdmin)}</p>
                <p style="margin: 5px 0;"><b>Comisión a pagar (5% de ganancia):</b> <span style="color: #dc2626; font-weight: bold;">${currencyFormatter.format(comisionPagar)}</span></p>
                <p style="margin: 15px 0 5px 0; padding-top: 10px; border-top: 1px solid #e2e8f0;"><b>Propiedad:</b> ${data.title}</p>
                <p style="margin: 5px 0;"><b>Ubicación:</b> ${data.city}, ${data.province}</p>
                <p style="margin: 5px 0;"><b>Fecha de cierre:</b> ${data.saleDate}</p>
            </div>
        `;
    } else {
        // Formato original para Alquiler
        contentHtml = `
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1;">
                <p><b>Propiedad:</b> ${data.title}</p>
                <p><b>Tipo:</b> ${data.type}</p>
                <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
                <p style="font-size: 18px; color: #1e293b; margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                  <b>Precio de cierre:</b> <span style="color: #16a34a;">${formattedSalePrice}</span>
                </p>
                <p style="margin-top: 10px;"><b>Fecha de la transacción:</b> ${data.saleDate}</p>
            </div>
        `;
    }

    const subject = `✅ ${isSale ? 'Propiedad Vendida' : 'Propiedad Alquilada'} - ${data.title}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">¡${isSale ? 'Venta' : 'Alquiler'} Registrado!</h2>
        <p style="font-size: 16px;">Detalles de la transacción en el sistema:</p>
        ${contentHtml}
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
    const currencyFormatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 });
    const formattedListingPrice = currencyFormatter.format(data.price);
    const formattedSalePrice = currencyFormatter.format(data.salePrice);
    
    // Cálculos de comisión
    const gananciaAdmin = data.salePrice * 0.05;
    const comisionPagar = gananciaAdmin * 0.05;

    const subject = `✅ Terreno Vendido - ${data.title}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">¡Venta de Terreno Registrada!</h2>
        <p style="font-size: 16px;">Detalles del cierre:</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1;">
            <p style="margin: 5px 0;"><b>Categoría:</b> ${data.lotType}</p>
            <p style="margin: 5px 0;"><b>Precio de publicación:</b> ${formattedListingPrice}</p>
            <p style="margin: 5px 0; font-size: 18px; color: #1e293b;"><b>Precio de venta:</b> <span style="color: #16a34a; font-weight: bold;">${formattedSalePrice}</span></p>
            <p style="margin: 15px 0 5px 0; padding-top: 10px; border-top: 1px solid #e2e8f0;"><b>Ganancia del admin (5%):</b> ${currencyFormatter.format(gananciaAdmin)}</p>
            <p style="margin: 5px 0;"><b>Comisión a pagar (5% de ganancia):</b> <span style="color: #dc2626; font-weight: bold;">${currencyFormatter.format(comisionPagar)}</span></p>
            <p style="margin: 15px 0 5px 0; padding-top: 10px; border-top: 1px solid #e2e8f0;"><b>Título:</b> ${data.title}</p>
            <p style="margin: 5px 0;"><b>Ubicación:</b> ${data.city}, ${data.province}</p>
            <p style="margin: 5px 0;"><b>Fecha de venta:</b> ${data.saleDate}</p>
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
