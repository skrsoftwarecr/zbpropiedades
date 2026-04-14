
'use client';
import { Auth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const signInWithEmail = async (auth: Auth, email: string, pass: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, pass);
};

export const signOutUser = async (auth: Auth): Promise<void> => {
    return await signOut(auth);
};
