'use client';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, UserCredential } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (auth: Auth): Promise<UserCredential> => {
    return await signInWithPopup(auth, googleProvider);
};

export const signOutUser = async (auth: Auth): Promise<void> => {
    return await signOut(auth);
};
