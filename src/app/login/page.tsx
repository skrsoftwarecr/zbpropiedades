import type { Metadata } from 'next';
import { UserAuthForm } from '@/components/auth/user-auth-form';
import { Logo } from '@/components/shared/Logo';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Authentication for administrators.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Acceso de Administrador
          </h1>
          <p className="text-sm text-muted-foreground">
            Inicie sesión para gestionar el contenido del sitio.
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
}
