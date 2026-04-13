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
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const col = collection(db, 'properties');
        const snap = await getDocs(col);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
    }
}

export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const ref = doc(db, 'properties', id);
        const snap = await getDoc(ref);
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Property) : null;
    } catch (error) {
        console.error("Error fetching property by id:", error);
        return null;
    }
}

export async function getLots(): Promise<Lot[]> {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const col = collection(db, 'lots');
        const snap = await getDocs(col);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Lot));
    } catch (error) {
        console.error("Error fetching lots:", error);
        return [];
    }
}

export async function getLotById(id: string): Promise<Lot | null> {
    try {
        const app = getFirebaseForServer();
        const db = getFirestore(app);
        const ref = doc(db, 'lots', id);
        const snap = await getDoc(ref);
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Lot) : null;
    } catch (error) {
        console.error("Error fetching lot by id:", error);
        return null;
    }
}