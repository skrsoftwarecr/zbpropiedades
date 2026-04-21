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

  try {
    // 1. Actualizar Propiedad
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
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #16a34a;">Propiedad Vendida</h2>
            <p><b>Propiedad:</b> ${property.title}</p>
            <p><b>Tipo:</b> ${property.type}</p>
            <p><b>Ciudad:</b> ${property.city}</p>
            <p><b>Monto de venta:</b> ${formattedPrice}</p>
            <p><b>Fecha de venta:</b> ${fechaVenta}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Registrado automáticamente por el Sistema ZB Admin el ${new Date().toLocaleString('es-CR')}.
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

    // 2. Notificar Eliminación
    await addDoc(collection(firestore, 'mail'), {
      to: 'skrsoftwarecr@gmail.com',
      message: {
        subject: `🗑️ Propiedad Eliminada - ${property.title}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #dc2626;">Propiedad Eliminada</h2>
            <p>Se ha removido permanentemente un registro del sistema:</p>
            <p><b>Propiedad:</b> ${property.title}</p>
            <p><b>Tipo:</b> ${property.type}</p>
            <p><b>Ciudad:</b> ${property.city}</p>
            <p><b>Precio original:</b> ${formattedPrice}</p>
            <p><b>Estado al eliminar:</b> ${property.status || 'Disponible'}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Eliminada el ${new Date().toLocaleString('es-CR')}.
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
