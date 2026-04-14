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

// --- Seed Utility ---

export function seedDatabase(firestore: Firestore) {
  const sampleProperties: PropertyData[] = [
    {
      title: "Casa de Lujo en Escazú",
      description: "Increíble propiedad con acabados de mármol, piscina privada y vista a la ciudad. Ubicada en la zona más exclusiva de San José.",
      price: 450000,
      type: "Casa",
      province: "San José",
      city: "Escazú",
      bedrooms: 4,
      bathrooms: 3.5,
      parking: 3,
      area_m2: 350,
      imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800"],
      features: ["Piscina", "Seguridad 24/7", "Vista Panorámica", "Jardín"]
    },
    {
      title: "Apartamento Moderno en Heredia",
      description: "Apartamento de concepto abierto, ideal para parejas jóvenes o ejecutivos. Cerca de zonas francas y centros comerciales.",
      price: 185000,
      type: "Apartamento",
      province: "Heredia",
      city: "San Francisco",
      bedrooms: 2,
      bathrooms: 2,
      parking: 2,
      area_m2: 95,
      imageUrls: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"],
      features: ["Gimnasio", "Casa Club", "Parqueo de visitas", "Ascensor"]
    }
  ];

  const sampleLots: LotData[] = [
    {
      title: "Quinta en San Carlos",
      description: "Terreno totalmente plano con árboles frutales y frente a calle pública. Ideal para casa de campo o inversión agrícola.",
      price: 75000,
      province: "Alajuela",
      city: "La Fortuna",
      area_m2: 5000,
      topography: "Plana",
      imageUrls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"],
      features: ["Agua propia", "Luz eléctrica", "Frente a calle principal"]
    }
  ];

  for (const p of sampleProperties) {
    addProperty(firestore, p);
  }
  for (const l of sampleLots) {
    addLot(firestore, l);
  }
}
