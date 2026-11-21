'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth-client';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { PizzaLoader } from '@/components/common/PizzaLoader';

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace(`/dashboard/${user.role}`);
    } else {
      router.replace('/sign-in');
    }
  }, [router]);

  return (
    <AuthGuard>
      <div className="min-h-[70vh] flex items-center justify-center">
        <PizzaLoader message="Directing to your personalized portal..." />
      </div>
    </AuthGuard>
  );
}
