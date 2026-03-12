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
import type { Product, Vehicle } from '@/lib/types';

// --- Product Actions ---

type ProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export function addProduct(firestore: Firestore, productData: ProductData) {
  const productsCollection = collection(firestore, 'products');
  addDoc(productsCollection, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'create',
      path: productsCollection.path,
      requestResourceData: productData,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw contextualError;
  });
}

export function updateProduct(
  firestore: Firestore,
  productId: string,
  productData: Partial<ProductData>
) {
  const productDoc = doc(firestore, 'products', productId);
  updateDoc(productDoc, {
    ...productData,
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'update',
      path: productDoc.path,
      requestResourceData: productData,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw contextualError;
  });
}

export function deleteProduct(firestore: Firestore, productId: string) {
  const productDoc = doc(firestore, 'products', productId);
  deleteDoc(productDoc).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'delete',
      path: productDoc.path,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw contextualError;
  });
}

// --- Vehicle Actions ---

type VehicleData = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

export function addVehicle(firestore: Firestore, vehicleData: VehicleData) {
  const vehiclesCollection = collection(firestore, 'vehicles');
  addDoc(vehiclesCollection, {
    ...vehicleData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'create',
      path: vehiclesCollection.path,
      requestResourceData: vehicleData,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw contextualError;
  });
}

export function updateVehicle(
  firestore: Firestore,
  vehicleId: string,
  vehicleData: Partial<VehicleData>
) {
  const vehicleDoc = doc(firestore, 'vehicles', vehicleId);
  updateDoc(vehicleDoc, {
    ...vehicleData,
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'update',
      path: vehicleDoc.path,
      requestResourceData: vehicleData,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw contextualError;
  });
}

export function deleteVehicle(firestore: Firestore, vehicleId: string) {
  const vehicleDoc = doc(firestore, 'vehicles', vehicleId);
  deleteDoc(vehicleDoc).catch((error) => {
    const contextualError = new FirestorePermissionError({
      operation: 'delete',
      path: vehicleDoc.path,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw contextualError;
  });
}
