'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { ShoppingBag, Clock, CheckCircle2, XCircle, ArrowRight, Pizza } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CustomerDashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get('/orders/customer');
        if (res.data.success) {
          setOrders(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const total = orders.length;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const accepted = orders.filter((o) => o.status === 'accepted').length;
  const rejected = orders.filter((o) => o.status === 'rejected').length;

  return (
    <AuthGuard allowedRoles={['customer', 'vendor']}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                Customer Overview
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                Track your active pizza deliveries and order history
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-600/20 transition-all self-start sm:self-auto"
            >
              <Pizza className="w-4 h-4" />
              <span>Order Fresh Pizza</span>
            </Link>
          </div>

          {loading ? (
            <PizzaLoader message="Loading your order statistics..." />
          ) : (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pizza-50 dark:bg-pizza-950 text-pizza-600 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Total Orders</p>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">{total}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Pending</p>
                    <p className="text-2xl font-black text-amber-600">{pending}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Accepted</p>
                    <p className="text-2xl font-black text-emerald-600">{accepted}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Rejected</p>
                    <p className="text-2xl font-black text-red-600">{rejected}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="font-bold text-lg text-stone-900 dark:text-white">Recent Orders</h3>
                  <Link
                    href="/dashboard/customer/orders"
                    className="text-xs font-bold text-pizza-600 hover:text-pizza-700 flex items-center gap-1"
                  >
                    View All Orders <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 text-sm">
                    No orders placed yet. Head over to the menu to explore hot pizzas!
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 dark:divide-stone-800 mt-2">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order._id} className="py-4 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.item?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100'}
                            alt={order.item?.itemName || 'Pizza'}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                              {order.item?.itemName || 'Delicious Pizza'}
                            </h4>
                            <p className="text-xs text-stone-400">
                              By {order.vendor?.businessName || order.vendor?.name} • For {order.deliveryDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                                : order.status === 'pending'
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                                : 'bg-red-50 text-red-600 dark:bg-red-950/60'
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="font-black text-sm text-stone-900 dark:text-white">
                            {order.item ? formatPrice(order.item.price) : ''}
                          </span>
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
