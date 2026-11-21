'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getStoredUser, getStoredToken, fetchCurrentProfile, clearAuthSession } from '@/lib/auth-client';
import { User, UserRole } from '@/types';
import { PizzaLoader } from '../common/PizzaLoader';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const token = getStoredToken();
      if (!token) {
        if (isMounted) {
          setIsLoading(false);
          router.replace(`/sign-in?returnUrl=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      // Check current stored user or rehydrate from server
      let currentUser = getStoredUser();
      if (!currentUser) {
        currentUser = await fetchCurrentProfile();
      }

      if (!currentUser) {
        if (isMounted) {
          clearAuthSession();
          setIsLoading(false);
          router.replace(`/sign-in?returnUrl=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      if (currentUser.isBlocked) {
        toast.error('Your account is currently suspended. Access denied.');
        clearAuthSession();
        router.replace('/sign-in');
        return;
      }

      // Verify Role Permissions
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        toast.error(`Unauthorized access. Redirected to your ${currentUser.role} dashboard.`);
        router.replace(`/dashboard/${currentUser.role}`);
        return;
      }

      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <PizzaLoader message="Verifying authentication credentials..." size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
