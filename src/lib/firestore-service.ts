'use client';

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Property, Lot } from '@/lib/types';

// --- Property Actions ---

type PropertyData = Omit<Property, 'id' | 'createdAt'>;

export function addProperty(firestore: Firestore, data: PropertyData) {
  const col = collection(firestore, 'properties');
  addDoc(col, {
    ...data,
    status: data.status || 'Disponible',
    createdAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'create',
      path: col.path,
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', contextualError);
  });
}

export function updateProperty(
  firestore: Firestore,
  id: string,
  data: Partial<PropertyData>
) {
  const ref = doc(firestore, 'properties', id);
  updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'update',
      path: ref.path,
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', contextualError);
  });
}

export async function markPropertyAsSold(
  firestore: Firestore,
  property: Property,
  montoVenta: number,
  fechaVenta: string // Formato YYYY-MM-DD
) {
  const ref = doc(firestore, 'properties', property.id);
  const formattedPrice = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(montoVenta);
  const formattedDate = fechaVenta.split('-').reverse().join('/');

  try {
    // 1. Actualizar Propiedad en Firestore
    await updateDoc(ref, {
      status: 'Vendido',
      montoVenta,
      fechaVenta,
      soldAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 2. Registrar Email de Notificación (Firebase Trigger Email)
    await addDoc(collection(firestore, 'mail'), {
      to: 'skrsoftwarecr@gmail.com',
      message: {
        subject: `✅ Propiedad Vendida - ${property.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">Registro de Cierre Exitoso</h2>
            <p style="font-size: 16px;">Se ha registrado la venta de la siguiente propiedad:</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Propiedad:</strong> ${property.title}</p>
              <p style="margin: 5px 0;"><strong>Tipo:</strong> ${property.type}</p>
              <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${property.city}, ${property.province}</p>
              <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
              <p style="font-size: 18px; margin: 5px 0;"><strong>Monto de Cierre:</strong> <span style="color: #16a34a;">${formattedPrice}</span></p>
              <p style="margin: 5px 0;"><strong>Fecha de la Venta:</strong> ${formattedDate}</p>
            </div>
            <p style="margin-top: 25px; font-size: 12px; color: #666; text-align: center;">
              Mensaje automático de ZB Propiedades Admin - ${new Date().toLocaleDateString('es-CR')}
            </p>
          </div>
        `
      }
    });
  } catch (error: any) {
    const contextualError = new FirestorePermissionError({
      operation: 'update',
      path: ref.path,
      requestResourceData: { status: 'Vendido', montoVenta, fechaVenta },
    });
    errorEmitter.emit('permission-error', contextualError);
    throw error;
  }
}

export async function deletePropertyPermanent(firestore: Firestore, property: Property) {
  const ref = doc(firestore, 'properties', property.id);
  const formattedPrice = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(property.price);

  try {
    // 1. Eliminar Documento
    await deleteDoc(ref);

    // 2. Notificar Eliminación por correo
    await addDoc(collection(firestore, 'mail'), {
      to: 'skrsoftwarecr@gmail.com',
      message: {
        subject: `🗑️ Propiedad Eliminada - ${property.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Registro Eliminado</h2>
            <p style="font-size: 16px;">Se ha removido permanentemente el siguiente registro del sistema:</p>
            <div style="background-color: #fdf2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 5px 0;"><strong>Propiedad:</strong> ${property.title}</p>
              <p style="margin: 5px 0;"><strong>Tipo:</strong> ${property.type}</p>
              <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${property.city}, ${property.province}</p>
              <p style="margin: 5px 0;"><strong>Precio original:</strong> ${formattedPrice}</p>
              <p style="margin: 5px 0;"><strong>Estado final:</strong> ${property.status || 'Disponible'}</p>
            </div>
            <p style="margin-top: 25px; font-size: 12px; color: #666; text-align: center;">
              Notificación de seguridad - Panel ZB Admin - ${new Date().toLocaleDateString('es-CR')}
            </p>
          </div>
        `
      }
    });
  } catch (error: any) {
    const contextualError = new FirestorePermissionError({
      operation: 'delete',
      path: ref.path,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw error;
  }
}

export function deleteProperty(firestore: Firestore, id: string) {
  const ref = doc(firestore, 'properties', id);
  deleteDoc(ref).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'delete',
      path: ref.path,
    });
    errorEmitter.emit('permission-error', contextualError);
  });
}

// --- Lot Actions ---

type LotData = Omit<Lot, 'id' | 'createdAt'>;

export function addLot(firestore: Firestore, data: LotData) {
  const col = collection(firestore, 'lots');
  addDoc(col, {
    ...data,
    status: data.status || 'Disponible',
    createdAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'create',
      path: col.path,
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', contextualError);
  });
}

export function updateLot(
  firestore: Firestore,
  id: string,
  data: Partial<LotData>
) {
  const ref = doc(firestore, 'lots', id);
  updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'update',
      path: ref.path,
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', contextualError);
  });
}

export function deleteLot(firestore: Firestore, id: string) {
  const ref = doc(firestore, 'lots', id);
  deleteDoc(ref).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'delete',
      path: ref.path,
    });
    errorEmitter.emit('permission-error', contextualError);
  });
}
