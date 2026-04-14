'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase/provider';
import { signInWithEmail } from '@/firebase/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function UserAuthForm() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorHint, setErrorHint] = React.useState<string | null>(null);
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
    setErrorHint(null);

    try {
      await signInWithEmail(auth, email, password);
      router.replace('/admin');
    } catch (error: any) {
      let message = 'Error al iniciar sesión.';
      
      // Firebase v10+ devuelve auth/invalid-credential para múltiples casos
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/operation-not-allowed') {
        message = 'Credenciales inválidas o acceso no permitido.';
        setErrorHint('IMPORTANTE: Asegúrese de que en su Firebase Console -> Authentication -> Sign-in method, el proveedor "Correo electrónico/contraseña" esté habilitado.');
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
      {errorHint && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Acción Requerida en Firebase Console</AlertTitle>
          <AlertDescription className="text-xs mt-1 leading-relaxed">
            {errorHint}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@zbpropiedades.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar al Panel
          </Button>
        </div>
      </form>
    </div>
  );
}
