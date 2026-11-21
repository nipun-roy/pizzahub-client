'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { fetchCurrentProfile } from '@/lib/auth-client';
import { PizzaLoader } from '@/components/common/PizzaLoader';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Rehydrate profile from backend to reflect premium state once webhook is processed
    const timer = setTimeout(() => {
      fetchCurrentProfile();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 text-center shadow-xl space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <Sparkles className="w-3.5 h-3.5" /> Premium Active
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Subscription Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Thank you for upgrading! Your restaurant account now has unlimited menu item publishing and verified featured placement on PizzaHub.
        </p>
      </div>

      {sessionId && (
        <p className="text-[11px] font-mono text-stone-400 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800 truncate">
          Session: {sessionId}
        </p>
      )}

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/vendor"
          className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-600/30 transition-all flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
        <Link
          href="/dashboard/vendor/add-item"
          className="flex-1 py-3 px-4 rounded-xl font-bold text-sm border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-2"
        >
          <span>Add Menu Item</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-stone-50/50 dark:bg-stone-950">
      <Suspense fallback={<PizzaLoader message="Confirming your payment..." />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
