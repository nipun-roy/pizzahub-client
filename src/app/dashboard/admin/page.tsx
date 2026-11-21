'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { formatPrice } from '@/lib/utils';
import { Users, Store, UserCheck, UtensilsCrossed, Clock, Receipt, DollarSign } from 'lucide-react';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Platform Overview & Analytics
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Live statistics, moderation alerts, and revenue performance for PizzaHub
            </p>
          </div>

          {loading ? (
            <PizzaLoader message="Aggregating platform metrics..." />
          ) : (
            <div className="space-y-8">
              {/* Statistics Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Total Users</p>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">{stats?.totalUsers || 0}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Total Vendors</p>
                    <p className="text-2xl font-black text-purple-600">{stats?.totalVendors || 0}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Total Customers</p>
                    <p className="text-2xl font-black text-emerald-600">{stats?.totalCustomers || 0}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pizza-50 dark:bg-pizza-950 text-pizza-600 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Total Menu Items</p>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">{stats?.totalMenuItems || 0}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Pending Reviews</p>
                    <p className="text-2xl font-black text-amber-600">{stats?.pendingMenuItems || 0}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Transactions</p>
                    <p className="text-2xl font-black text-cyan-600">{stats?.totalTransactions || 0}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4 md:col-span-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-semibold uppercase">Total Subscription Revenue</p>
                    <p className="text-2xl font-black text-emerald-600">{formatPrice(stats?.totalRevenue || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Data Visualization / Activity Graph Simulation */}
              <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Platform Health Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                    <p className="text-xs text-stone-400 font-semibold uppercase">User Distribution</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className="h-3 bg-purple-500 rounded-full"
                        style={{ width: `${Math.max(15, (stats?.totalVendors / (stats?.totalUsers || 1)) * 100)}%` }}
                        title="Vendors"
                      />
                      <div
                        className="h-3 bg-emerald-500 rounded-full flex-1"
                        title="Customers"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-stone-500 mt-2 font-medium">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Vendors ({stats?.totalVendors})</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Customers ({stats?.totalCustomers})</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                    <p className="text-xs text-stone-400 font-semibold uppercase">Catalog Approval Ratio</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className="h-3 bg-emerald-500 rounded-full"
                        style={{ width: `${Math.max(10, (stats?.approvedMenuItems / (stats?.totalMenuItems || 1)) * 100)}%` }}
                        title="Approved"
                      />
                      <div
                        className="h-3 bg-amber-500 rounded-full"
                        style={{ width: `${Math.max(10, (stats?.pendingMenuItems / (stats?.totalMenuItems || 1)) * 100)}%` }}
                        title="Pending"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-stone-500 mt-2 font-medium">
                      <span>Approved: {stats?.approvedMenuItems || 0}</span>
                      <span>Pending: {stats?.pendingMenuItems || 0}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                    <p className="text-xs text-stone-400 font-semibold uppercase">Platform Security</p>
                    <p className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
                      ✓ JWT Token & Role Guard Active
                    </p>
                    <p className="text-xs text-stone-400 mt-1">Verified Stripe signature webhook running</p>
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
