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
import { notifyPropertySale, notifyPropertyDeletion, notifyLotSale, notifyLotDeletion } from './actions';

// --- Acciones de Propiedades ---

type PropertyData = Omit<Property, 'id' | 'createdAt'>;

export async function addProperty(firestore: Firestore, data: PropertyData) {
  const col = collection(firestore, 'properties');
  try {
    await addDoc(col, {
      ...data,
      status: data.status || 'Disponible',
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'create', path: col.path, requestResourceData: data }));
  }
}

export async function updateProperty(firestore: Firestore, id: string, data: Partial<PropertyData>) {
  const ref = doc(firestore, 'properties', id);
  try {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'update', path: ref.path, requestResourceData: data }));
  }
}

export async function markPropertyAsSold(firestore: Firestore, property: Property, montoVenta: number, fechaVenta: string) {
  const ref = doc(firestore, 'properties', property.id);
  try {
    // 1. Actualizar base de datos
    await updateDoc(ref, { 
      status: 'Vendido', 
      montoVenta, 
      fechaVenta, 
      soldAt: serverTimestamp(), 
      updatedAt: serverTimestamp() 
    });
    
    // 2. Disparar notificación por correo vía Server Action
    await notifyPropertySale({ 
      title: property.title, 
      type: property.type,
      operationType: property.operationType,
      city: property.city, 
      province: property.province, 
      price: property.price, 
      salePrice: montoVenta, 
      saleDate: fechaVenta 
    });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ 
      operation: 'update', 
      path: ref.path, 
      requestResourceData: { status: 'Vendido', montoVenta, fechaVenta } 
    }));
    throw error;
  }
}

export async function deletePropertyPermanent(firestore: Firestore, property: Property) {
  const ref = doc(firestore, 'properties', property.id);
  try {
    // 1. Eliminar de Firestore
    await deleteDoc(ref);
    
    // 2. Notificar eliminación vía Server Action
    await notifyPropertyDeletion({ 
      title: property.title, 
      type: property.type, 
      city: property.city, 
      province: property.province, 
      price: property.price 
    });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'delete', path: ref.path }));
    throw error;
  }
}

// --- Acciones de Lotes ---

type LotData = Omit<Lot, 'id' | 'createdAt'>;

export async function updateAppointmentStatus(
  firestore: Firestore,
  id: string,
  status: 'Completed' | 'Cancelled'
) {
  const ref = doc(firestore, 'appointments', id);
  try {
    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        operation: 'update',
        path: ref.path,
        requestResourceData: { status },
      })
    );
    throw error;
  }
}

export async function addLot(firestore: Firestore, data: LotData) {
  const col = collection(firestore, 'lots');
  try {
    await addDoc(col, {
      ...data,
      status: data.status || 'Disponible',
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'create', path: col.path, requestResourceData: data }));
  }
}

export async function updateLot(firestore: Firestore, id: string, data: Partial<LotData>) {
  const ref = doc(firestore, 'lots', id);
  try {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'update', path: ref.path, requestResourceData: data }));
  }
}

export async function markLotAsSold(firestore: Firestore, lot: Lot, montoVenta: number, fechaVenta: string) {
  const ref = doc(firestore, 'lots', lot.id);
  try {
    // 1. Actualizar DB
    await updateDoc(ref, { 
      status: 'Vendido', 
      montoVenta, 
      fechaVenta, 
      soldAt: serverTimestamp(), 
      updatedAt: serverTimestamp() 
    });
    
    // 2. Notificar por correo vía Server Action
    await notifyLotSale({ 
      title: lot.title, 
      lotType: lot.lotType, 
      city: lot.city, 
      province: lot.province, 
      price: lot.price, 
      salePrice: montoVenta, 
      saleDate: fechaVenta 
    });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ 
      operation: 'update', 
      path: ref.path, 
      requestResourceData: { status: 'Vendido', montoVenta, fechaVenta } 
    }));
    throw error;
  }
}

export async function deleteLotPermanent(firestore: Firestore, lot: Lot) {
  const ref = doc(firestore, 'lots', lot.id);
  try {
    // 1. Eliminar DB
    await deleteDoc(ref);
    
    // 2. Notificar por correo vía Server Action
    await notifyLotDeletion({ 
      title: lot.title, 
      lotType: lot.lotType, 
      city: lot.city, 
      province: lot.province, 
      price: lot.price 
    });
  } catch (error: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'delete', path: ref.path }));
    throw error;
  }
}

export function deleteLot(firestore: Firestore, id: string) {
  const ref = doc(firestore, 'lots', id);
  deleteDoc(ref).catch((error) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'delete', path: ref.path }));
  });
}
