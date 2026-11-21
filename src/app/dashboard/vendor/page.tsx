'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { getStoredUser } from '@/lib/auth-client';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { UtensilsCrossed, CheckCircle2, Clock, ShoppingBag, Sparkles, PlusCircle, ArrowRight } from 'lucide-react';

export default function VendorDashboardOverview() {
  const user = getStoredUser();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [subStatus, setSubStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [itemsRes, ordersRes, subRes] = await Promise.all([
          api.get('/menu/vendor/my-items'),
          api.get('/orders/vendor'),
          api.get('/subscriptions/status'),
        ]);

        if (itemsRes.data.success) setMenuItems(itemsRes.data.data || []);
        if (ordersRes.data.success) setOrders(ordersRes.data.data || []);
        if (subRes.data.success) setSubStatus(subRes.data.data);
      } catch (err) {
        console.error('Error loading vendor overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalItems = menuItems.length;
  const activeItems = menuItems.filter((i) => i.status === 'approved').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;

  const isPremium = user?.subscriptionPlan === 'premium' || subStatus?.plan === 'premium';

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  {user?.businessName || 'Restaurant Kitchen'}
                </h1>
                {isPremium ? (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> Premium Vendor
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    Free Plan (Max 3 Active Items)
                  </span>
                )}
              </div>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                Overview of your published pizzas, orders, and restaurant subscription
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isPremium && (
                <Link
                  href="/dashboard/vendor/subscription"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
                >
                  Upgrade to Premium
                </Link>
              )}
              <Link
                href="/dashboard/vendor/add-item"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Menu Item</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <PizzaLoader message="Loading restaurant statistics..." />
          ) : (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pizza-50 dark:bg-pizza-950 text-pizza-600 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Total Menu Items</p>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">{totalItems}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Active Menu Items</p>
                    <p className="text-2xl font-black text-emerald-600">{activeItems}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Pending Orders</p>
                    <p className="text-2xl font-black text-amber-600">{pendingOrders}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Accepted Orders</p>
                    <p className="text-2xl font-black text-blue-600">{acceptedOrders}</p>
                  </div>
                </div>
              </div>

              {/* Free Limit Warning Banner if applicable */}
              {!isPremium && totalItems >= 3 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      You have reached the Free Tier limit of 3 menu items.
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Upgrade to Premium to publish unlimited pizzas, unlock the verified badge, and get featured placement.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/vendor/subscription"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                  >
                    Upgrade Now ($19.99)
                  </Link>
                </div>
              )}

              {/* Incoming Orders Alert */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="font-bold text-lg text-stone-900 dark:text-white">Recent Customer Orders</h3>
                  <Link
                    href="/dashboard/vendor/orders"
                    className="text-xs font-bold text-pizza-600 hover:text-pizza-700 flex items-center gap-1"
                  >
                    Manage All Orders ({pendingOrders} Pending) <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="py-10 text-center text-stone-400 text-sm">
                    No incoming customer orders yet.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 dark:divide-stone-800 mt-2">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order._id} className="py-4 flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                            {order.item?.itemName}
                          </h4>
                          <p className="text-xs text-stone-400">
                            Customer: {order.customer?.name} ({order.customer?.email}) • For {order.deliveryDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-600'
                                : order.status === 'pending'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {order.status}
                          </span>
                          <Link
                            href="/dashboard/vendor/orders"
                            className="px-3 py-1.5 text-xs font-bold text-pizza-600 hover:bg-pizza-50 dark:hover:bg-pizza-950/40 rounded-lg transition-colors"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
