'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase/provider';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user auth state is resolved
    }

    if (!user) {
      router.replace('/login'); // Not signed in, redirect to login
      return;
    }

    // User is signed in, check for admin privileges
    const checkAdmin = async () => {
      const adminDocRef = doc(firestore, 'admins', user.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (!adminDoc.exists()) {
        // Not an admin, redirect to home
        console.warn('User is not an admin. Redirecting...');
        router.replace('/');
      }
    };

    checkAdmin();
  }, [user, isUserLoading, router, firestore]);

  if (isUserLoading || !user) {
    // Show a loading state while checking auth
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="space-y-4 w-1/2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }

  // If we reach here, user is likely an admin (or check is in progress)
  // The checkAdmin effect will redirect if they are not.
  return <>{children}</>;
}
