
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard, Landmark, PanelLeft, LogOut, Trees } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/firebase/provider';
import { signOutUser } from '@/firebase/auth-service';

const AdminSidebarNav = ({ isSheet = false }: { isSheet?: boolean }) => {
  const pathname = usePathname();
  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/properties', label: 'Propiedades', icon: Home },
    { href: '/admin/lots', label: 'Lotes', icon: Landmark },
    { href: '/admin/quintas', label: 'Quintas', icon: Trees },
  ];

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        
        const linkContent = (
            <Link
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''
                }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
        );

        if (isSheet) {
          return (
            <SheetClose asChild key={link.href}>
              {linkContent}
            </SheetClose>
          );
        }

        return (
          <div key={link.href}>
            {linkContent}
          </div>
        );
      })}
    </nav>
  );
};


export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace('/login');
    } else {
      setIsChecking(false);
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await signOutUser(auth);
    router.replace('/');
  };

  if (isChecking || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              <span className="">ZB Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <AdminSidebarNav />
          </div>
          <div className="p-4 mt-auto border-t">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle asChild>
                  <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
                    <Logo className="h-6 w-6 text-primary" />
                    <span>ZB Admin</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <AdminSidebarNav isSheet />
              <div className="p-4 mt-auto border-t">
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <p className="text-sm font-medium text-muted-foreground">Sesión: {user?.email}</p>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
