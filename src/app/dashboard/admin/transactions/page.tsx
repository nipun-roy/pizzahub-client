'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { Transaction } from '@/types';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { formatPrice } from '@/lib/utils';
import { Receipt, CheckCircle2, ShieldCheck, Store, Calendar } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTx() {
      try {
        const res = await api.get('/admin/transactions');
        if (res.data.success) {
          setTransactions(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTx();
  }, []);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                Platform Transactions
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                Stripe payment logs for vendor premium subscriptions (Strictly read-only)
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4" />
              <span>Immutable Ledger</span>
            </div>
          </div>

          {loading ? (
            <PizzaLoader message="Fetching verified payment transactions..." />
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
              <Receipt className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">No Transactions Recorded</h3>
              <p className="text-xs text-stone-500">
                When vendors upgrade their subscription using Stripe, verified records will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      <th className="py-4 px-6">Transaction ID</th>
                      <th className="py-4 px-6">Vendor / Kitchen</th>
                      <th className="py-4 px-6">Subscription Plan</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-stone-500">
                          {tx.stripeSessionId ? tx.stripeSessionId.slice(0, 16) + '...' : `#${tx._id.slice(-8)}`}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-pizza-600 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-stone-900 dark:text-white">
                                {tx.vendor?.businessName || tx.vendor?.name || 'Artisan Kitchen'}
                              </p>
                              <p className="text-xs text-stone-400">{tx.vendor?.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {tx.plan}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-extrabold text-stone-900 dark:text-white">
                          {formatPrice(tx.amount)} <span className="text-[10px] uppercase text-stone-400">{tx.currency}</span>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 uppercase">
                            <CheckCircle2 className="w-3 h-3" /> {tx.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right text-xs text-stone-500">
                          {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
