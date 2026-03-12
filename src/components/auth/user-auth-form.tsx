'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase/provider';
import { signInWithGoogle, signOutUser } from '@/firebase/auth-service';
import { getRedirectResult } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);


export function UserAuthForm() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true); // Start as loading to handle redirect
  const { user, isUserLoading } = useUser();
  
  React.useEffect(() => {
    // This effect handles both redirect result and existing user session
    const handleAuth = async () => {
      // If user is already loaded and is admin, redirect
      if (!isUserLoading && user && user.email === 'skrsoftwarecr@gmail.com') {
        router.replace('/admin');
        return;
      }
      
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // A user has just signed in via redirect.
          if (result.user.email === 'skrsoftwarecr@gmail.com') {
            router.replace('/admin');
          } else {
            await signOutUser(auth);
            toast({
              variant: 'destructive',
              title: 'Acceso no autorizado',
              description: 'Este correo no tiene permisos de administrador.',
            });
            setIsLoading(false); // Stop loading after handling non-admin user
          }
        } else {
          // No redirect result, check for existing non-admin user or just stop loading
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Error getting redirect result:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Hubo un problema al verificar el inicio de sesión.',
        });
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [auth, isUserLoading, user, router, toast]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle(auth);
      // The page will redirect, and the useEffect will handle the result.
    } catch (error: any) {
      console.error(error);
      toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Hubo un problema al iniciar sesión con Google.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleSignIn}>
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <GoogleIcon />
        )}
        Continuar con Google
      </Button>
    </div>
  );
}
