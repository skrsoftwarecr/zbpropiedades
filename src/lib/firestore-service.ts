
'use client';

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Property, Lot, BatchOperationResult, AuditLog } from '@/lib/types';
import { notifyPropertySale, notifyPropertyDeletion } from './actions';

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
  fechaVenta: string,
  extraData?: Partial<Property>
) {
  const ref = doc(firestore, 'properties', property.id);

  try {
    await updateDoc(ref, {
      status: 'Vendido',
      montoVenta,
      fechaVenta,
      ...extraData,
      soldAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await notifyPropertySale({
      title: property.title,
      type: property.type,
      city: property.city,
      province: property.province,
      price: property.price,
      salePrice: montoVenta,
      saleDate: fechaVenta,
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

// --- BATCH OPERATIONS ---

export async function processBatchSale(
  firestore: Firestore,
  properties: Property[],
  saleData: {
    montoVenta?: number; // Si es compartido, sino se usa el de la prop
    fechaVenta: string;
    compradorNombre?: string;
    agenteResponsable?: string;
    notasVenta?: string;
  }
): Promise<BatchOperationResult> {
  const results: BatchOperationResult = {
    total: properties.length,
    exitosos: 0,
    fallidos: 0,
    detalles: []
  };

  const promises = properties.map(async (prop) => {
    try {
      // Validar disponibilidad actual
      const freshDoc = await getDoc(doc(firestore, 'properties', prop.id));
      if (!freshDoc.exists() || freshDoc.data()?.status === 'Vendido') {
        throw new Error('La propiedad ya no está disponible');
      }

      await markPropertyAsSold(
        firestore, 
        prop, 
        saleData.montoVenta || prop.price, 
        saleData.fechaVenta,
        {
          compradorNombre: saleData.compradorNombre,
          agenteResponsable: saleData.agenteResponsable,
          notasVenta: saleData.notasVenta
        }
      );
      
      results.exitosos++;
      results.detalles.push({ id: prop.id, success: true });
    } catch (e: any) {
      results.fallidos++;
      results.detalles.push({ id: prop.id, success: false, error: e.message });
    }
  });

  await Promise.allSettled(promises);
  return results;
}

export async function processBatchDelete(
  firestore: Firestore,
  properties: Property[],
  reason: string,
  userId: string,
  userName?: string
): Promise<BatchOperationResult> {
  const results: BatchOperationResult = {
    total: properties.length,
    exitosos: 0,
    fallidos: 0,
    detalles: []
  };

  // 1. Registro de Auditoría
  const auditRef = collection(firestore, 'audit_logs');
  await addDoc(auditRef, {
    action: 'DELETE_BATCH',
    targetIds: properties.map(p => p.id),
    userId,
    userName,
    reason,
    timestamp: serverTimestamp(),
    metadata: { titles: properties.map(p => p.title) }
  });

  // 2. Ejecución de eliminaciones
  const promises = properties.map(async (prop) => {
    try {
      await deletePropertyPermanent(firestore, prop);
      results.exitosos++;
      results.detalles.push({ id: prop.id, success: true });
    } catch (e: any) {
      results.fallidos++;
      results.detalles.push({ id: prop.id, success: false, error: e.message });
    }
  });

  await Promise.allSettled(promises);
  return results;
}

export async function deletePropertyPermanent(firestore: Firestore, property: Property) {
  const ref = doc(firestore, 'properties', property.id);

  try {
    await deleteDoc(ref);
    await notifyPropertyDeletion({
      title: property.title,
      type: property.type,
      city: property.city,
      province: property.province,
      price: property.price,
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
