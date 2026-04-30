'use server';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

const GAS_WEBAPP_URL = process.env.GAS_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbwIbK0IZvc7TOont320I9bvCh1SQ3TVrbol0TfSzxyIFO9wiVMjqUSo0JOea-z7taNv/exec';

function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

async function sendEmailViaGAS(to: string, subject: string, html: string) {
    try {
        const response = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify({ to, subject, html }),
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
        });
        if (!response.ok) return false;
        const result = await response.json();
        return result.result === 'success';
    } catch (error) {
        console.error("Fallo en GAS:", error);
        return false;
    }
}

async function logEmailInFirestore(to: string, subject: string, html: string) {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        await addDoc(collection(db, 'mail'), {
            to,
            message: { subject, html },
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error auditoría Firestore:', error);
    }
}

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
        const gananciaAdmin = data.salePrice * 0.05;
        const comisionPagar = gananciaAdmin * 0.05;
        contentHtml = `
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1;">
                <p style="margin: 5px 0;"><b>Tipo:</b> ${data.type}</p>
                <p style="margin: 5px 0;"><b>Precio Publicación:</b> ${formattedListingPrice}</p>
                <p style="margin: 5px 0; font-size: 18px;"><b>Precio Venta:</b> <span style="color: #16a34a; font-weight: bold;">${formattedSalePrice}</span></p>
                <p style="margin: 15px 0 5px 0; padding-top: 10px; border-top: 1px solid #e2e8f0;"><b>Ganancia Admin (5%):</b> ${currencyFormatter.format(gananciaAdmin)}</p>
                <p style="margin: 5px 0;"><b>Comisión a Pagar:</b> <span style="color: #dc2626; font-weight: bold;">${currencyFormatter.format(comisionPagar)}</span></p>
                <p style="margin-top: 10px;"><b>Propiedad:</b> ${data.title}</p>
            </div>`;
    } else {
        contentHtml = `<p><b>Alquiler registrado:</b> ${data.title} por ${formattedSalePrice}</p>`;
    }

    const subject = `✅ ${isSale ? 'Venta' : 'Alquiler'} - ${data.title}`;
    const html = `<div style="font-family: sans-serif; padding: 20px;">${contentHtml}</div>`;
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
    const currencyFormatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 });
    const gananciaAdmin = data.salePrice * 0.05;
    const comisionPagar = gananciaAdmin * 0.05;

    const subject = `✅ Terreno Vendido - ${data.title}`;
    const html = `<div style="font-family: sans-serif; padding: 20px;">
        <h3>Venta de Terreno</h3>
        <p><b>Publicación:</b> ${currencyFormatter.format(data.price)}</p>
        <p><b>Venta:</b> ${currencyFormatter.format(data.salePrice)}</p>
        <p><b>Comisión a pagar:</b> ${currencyFormatter.format(comisionPagar)}</p>
    </div>`;
    
    await logEmailInFirestore('skrsoftwarecr@gmail.com', subject, html);
    const sent = await sendEmailViaGAS('skrsoftwarecr@gmail.com', subject, html);
    return { success: sent };
}

export async function notifyPropertyDeletion(data: any) { return { success: true }; }
export async function notifyLotDeletion(data: any) { return { success: true }; }
