import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-stone-50/50 dark:bg-stone-950">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Payment Cancelled
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            The checkout session was cancelled. No charges were incurred, and your account remains on the Free Tier.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/vendor/subscription"
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-600/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Link>
          <Link
            href="/dashboard/vendor"
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
