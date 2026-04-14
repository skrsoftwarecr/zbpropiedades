
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
