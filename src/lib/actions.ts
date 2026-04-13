
'use server';

import type { Property, Lot } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Server-side firebase initialization
function getFirebaseForServer() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

export async function getProperties(): Promise<Property[]> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const col = collection(db, 'properties');
    const snap = await getDocs(col);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
}

export async function getPropertyById(id: string): Promise<Property | null> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const ref = doc(db, 'properties', id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Property) : null;
}

export async function getLots(): Promise<Lot[]> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const col = collection(db, 'lots');
    const snap = await getDocs(col);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Lot));
}

export async function getLotById(id: string): Promise<Lot | null> {
    const app = getFirebaseForServer();
    const db = getFirestore(app);
    const ref = doc(db, 'lots', id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Lot) : null;
}
