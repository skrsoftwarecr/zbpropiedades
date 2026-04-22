
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
 */
async function sendEmailViaGAS(to: string, subject: string, html: string) {
    console.log(`--- ENVIANDO CORREO A: ${to} ---`);
    try {
        const response = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify({ to, subject, html }),
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
        });

        const result = await response.json();
        return result.result === 'success';
    } catch (error) {
        console.error("❌ Fallo crítico al llamar a Google Apps Script:", error);
        return false;
    }
}

/**
 * Registra un documento en la colección 'mail' para Trigger Email.
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
    } catch (error) {
        console.error('❌ Error al escribir en colección "mail":', error);
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
    const formattedPrice = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(data.salePrice);
    const subject = `✅ Propiedad Vendida - ${data.title}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #16a34a;">Venta Registrada</h2>
        <p><b>Propiedad:</b> ${data.title}</p>
        <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
        <p><b>Monto de venta:</b> ${formattedPrice}</p>
        <p><b>Fecha de venta:</b> ${data.saleDate}</p>
      </div>
    `;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

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
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #16a34a;">Lote/Quinta Vendido</h2>
        <p><b>Título:</b> ${data.title}</p>
        <p><b>Tipo:</b> ${data.lotType}</p>
        <p><b>Ubicación:</b> ${data.city}, ${data.province}</p>
        <p><b>Monto de venta:</b> ${formattedPrice}</p>
        <p><b>Fecha de venta:</b> ${data.saleDate}</p>
      </div>
    `;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

export async function notifyPropertyDeletion(data: { title: string; type: string; city: string; province: string; price: number }) {
    const subject = `🗑️ Propiedad Eliminada - ${data.title}`;
    const html = `<h2>Propiedad Eliminada</h2><p><b>Título:</b> ${data.title}</p><p><b>Ubicación:</b> ${data.city}, ${data.province}</p>`;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

export async function notifyLotDeletion(data: { title: string; lotType: string; city: string; province: string; price: number }) {
    const subject = `🗑️ Lote Eliminado - ${data.title}`;
    const html = `<h2>Lote/Quinta Eliminado</h2><p><b>Título:</b> ${data.title}</p><p><b>Ubicación:</b> ${data.city}, ${data.province}</p>`;
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}
