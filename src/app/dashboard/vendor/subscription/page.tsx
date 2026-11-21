'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { getStoredUser } from '@/lib/auth-client';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { Check, Sparkles, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorSubscriptionPage() {
  const user = getStoredUser();
  const [subData, setSubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await api.get('/subscriptions/status');
        if (res.data.success) {
          setSubData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  const isPremium = user?.subscriptionPlan === 'premium' || subData?.plan === 'premium';

  const handleUpgrade = async () => {
    setCheckingOut(true);
    try {
      const res = await api.post('/subscriptions/create-checkout-session');
      if (res.data.success && res.data.url) {
        // Redirect to verified Stripe Checkout session
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate Stripe Checkout session');
      setCheckingOut(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout>
        <div className="max-w-4xl space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Restaurant Subscription Plan
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Unlock unlimited menu items, featured homepage placement, and premium branding
            </p>
          </div>

          {loading ? (
            <PizzaLoader message="Loading subscription benefits..." />
          ) : (
            <div className="space-y-8">
              {/* Current Status Pill Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Current Active Tier
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-black capitalize text-stone-900 dark:text-white">
                      {isPremium ? 'Premium Partner' : 'Free Tier'}
                    </span>
                    {isPremium && (
                      <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-amber-500 text-white flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> PRO BADGE ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-stone-400 font-semibold uppercase">Menu Publishing Limit</p>
                  <p className="text-lg font-bold text-pizza-600">
                    {subData?.activeItemsCount || 0} / {isPremium ? 'Unlimited' : '3 Items Max'}
                  </p>
                </div>
              </div>

              {/* Comparison Pricing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Free Tier Card */}
                <div className={`p-8 rounded-3xl bg-white dark:bg-stone-900 border flex flex-col justify-between ${!isPremium ? 'border-stone-300 dark:border-stone-700 shadow-md' : 'border-stone-200 dark:border-stone-800 opacity-80'}`}>
                  <div className="space-y-6">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        Starter
                      </span>
                      <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-3">Free Plan</h3>
                      <p className="text-xs text-stone-500 mt-1">For small pilot kitchens testing the waters</p>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-stone-900 dark:text-white">$0</span>
                        <span className="text-stone-400 text-xs">/ forever</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Publish up to <strong>3 active menu items</strong></span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Basic vendor analytics & order dashboard</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Incoming customer order notifications</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    {!isPremium ? (
                      <div className="w-full py-3 text-center text-xs font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 rounded-xl">
                        Current Active Plan
                      </div>
                    ) : (
                      <div className="w-full py-3 text-center text-xs font-semibold text-stone-400">
                        Included in your Premium plan
                      </div>
                    )}
                  </div>
                </div>

                {/* Premium Tier Card */}
                <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-900 border-2 border-amber-500 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Recommended
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        Pro Partner
                      </span>
                      <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-3">Premium Plan</h3>
                      <p className="text-xs text-stone-500 mt-1">For growing kitchens wanting maximum reach</p>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-pizza-600">$19.99</span>
                        <span className="text-stone-400 text-xs">/ one-time or monthly</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-xs text-stone-700 dark:text-stone-200">
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span><strong>Unlimited</strong> active & published pizzas</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span><strong>Featured placement</strong> on the PizzaHub homepage</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>Official verified <strong>Premium Restaurant Badge</strong></span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>Priority customer support & transaction receipt</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>All Free plan features included</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    {isPremium ? (
                      <div className="w-full py-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Active Premium Membership</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleUpgrade}
                        disabled={checkingOut}
                        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-pizza-600 hover:from-amber-600 hover:to-pizza-700 text-white shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>{checkingOut ? 'Redirecting to Stripe...' : 'Upgrade with Stripe ($19.99)'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
