'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, LayoutDashboard, Package, PanelLeft, CalendarClock } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/shared/Logo';

const AdminSidebarNav = ({ isSheet = false }: { isSheet?: boolean }) => {
  const pathname = usePathname();
  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Repuestos', icon: Package },
    { href: '/admin/vehicles', label: 'Vehículos', icon: Car },
    { href: '/admin/appointments', label: 'Citas', icon: CalendarClock },
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
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait until the user's authentication status is resolved.
    if (isUserLoading) {
      return;
    }

    // User is not logged in, redirect to login page.
    if (!user) {
      router.replace('/login');
      return;
    }

    // User is logged in, check if they are the authorized admin.
    if (user.email === 'skrsoftwarecr@gmail.com') {
      setIsAuthorized(true);
    } else {
      // If not the authorized admin, redirect to the homepage.
      router.replace('/');
    }

    setIsChecking(false);

  }, [user, isUserLoading, router]);

  if (isChecking || !isAuthorized) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 p-4">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex-1 space-y-2 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Skeleton className="h-8 w-8 md:hidden" />
            <div className="w-full flex-1">
              {/* Maybe a search skeleton here */}
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Skeleton className="h-8 w-64" />
            <div className="flex-1 rounded-lg border p-6 shadow-sm">
              <Skeleton className="h-96 w-full" />
            </div>
          </main>
        </div>
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
              <span className="">Bimmer CR Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <AdminSidebarNav />
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
                    <span>Bimmer CR Admin</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <AdminSidebarNav isSheet />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a header search or user menu here later */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
