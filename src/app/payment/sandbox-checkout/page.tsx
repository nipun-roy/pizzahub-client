'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pizza,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getStoredUser, fetchCurrentProfile } from '@/lib/auth-client';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { toast } from 'sonner';

function SandboxCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || `cs_test_sandbox_${Date.now()}`;
  const user = getStoredUser();

  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Chef Restaurant Owner');

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await api.post('/subscriptions/confirm-sandbox-payment', {
        sessionId,
      });

      if (res.data.success) {
        toast.success('Stripe Sandbox payment successful! Upgraded to Premium.');
        // Rehydrate user profile with new subscription plan
        await fetchCurrentProfile();
        router.push(`/payment/success?session_id=${sessionId}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment simulation failed');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
      {/* Left Column: Order Summary */}
      <div className="md:col-span-5 bg-stone-50 dark:bg-stone-950 p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800">
        <div className="space-y-6">
          <Link href="/dashboard/vendor/subscription" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Back</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pizza-600 text-white flex items-center justify-center font-bold">
                <Pizza className="w-4 h-4" />
              </div>
              <span className="font-black text-stone-900 dark:text-white">PizzaHub</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Stripe Sandbox
              </span>
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white mt-4">
              Vendor Premium Plan
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Monthly subscription for unlimited restaurant publishing.
            </p>
          </div>

          <div className="text-3xl font-black text-stone-900 dark:text-white">
            $19.99 <span className="text-sm font-normal text-stone-500">/ month</span>
          </div>

          <div className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Unlimited pizza menu item publishing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Featured placement on PizzaHub Homepage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Golden PRO Partner verification badge</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Priority order routing & instant notifications</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Encrypted 256-bit Stripe Checkout Sandbox</span>
        </div>
      </div>

      {/* Right Column: Simulated Stripe Card Form */}
      <div className="md:col-span-7 p-8 sm:p-10 space-y-6">
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <p className="font-bold">Stripe Sandbox Test Environment</p>
            <p className="text-[11px] leading-relaxed">
              This sandbox simulator lets you test the complete verified Stripe payment and webhook activation flow without requiring real banking credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSimulatePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Card Information (Test Card)
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-t-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
              <CreditCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
            <div className="grid grid-cols-2">
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM / YY"
                required
                className="w-full px-3.5 py-2.5 rounded-bl-xl border-t-0 border-r-0 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="CVC"
                required
                className="w-full px-3.5 py-2.5 rounded-br-xl border-t-0 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-pizza-600 hover:bg-pizza-700 text-white shadow-lg shadow-pizza-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Test Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay $19.99 (Simulate Stripe Success)</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-[11px] text-stone-400">
            Powered by <strong>Stripe Checkout API</strong> • Test Mode
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SandboxCheckoutPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-stone-50/50 dark:bg-stone-950">
      <Suspense fallback={<PizzaLoader message="Loading Stripe Checkout..." />}>
        <SandboxCheckoutContent />
      </Suspense>
    </div>
  );
}
