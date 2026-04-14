'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase/provider';
import { signInWithEmail } from '@/firebase/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function UserAuthForm() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useUser();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (user) {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmail(auth, email, password);
      router.replace('/admin');
    } catch (error: any) {
      console.error('Auth Error:', error.code, error.message);
      let message = 'Error al iniciar sesión. Verifique sus credenciales.';
      
      // Firebase v10+ suele devolver auth/invalid-credential para cualquier error de login
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-email'
      ) {
        message = 'Usuario o contraseña incorrectos. Asegúrese de haber creado el usuario en la consola de Firebase.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Error de Acceso',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@tuempresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar al Panel
          </Button>
        </div>
      </form>
    </div>
  );
}
