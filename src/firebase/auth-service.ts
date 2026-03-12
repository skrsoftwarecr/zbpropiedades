'use client';
import { Auth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (auth: Auth): Promise<void> => {
    await signInWithRedirect(auth, googleProvider);
};

export const signOutUser = async (auth: Auth): Promise<void> => {
    return await signOut(auth);
};
