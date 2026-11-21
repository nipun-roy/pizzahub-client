'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { MenuItem } from '@/types';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { formatPrice } from '@/lib/utils';
import { Check, X, Trash2, Search, Filter, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get('/admin/menu-items', { params });
      if (res.data.success) {
        setItems(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load menu items for administration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const handleUpdateStatus = async (itemId: string, status: 'approved' | 'rejected') => {
    setActionId(itemId);
    try {
      const res = await api.patch(`/admin/menu-items/${itemId}/status`, { status });
      if (res.data.success) {
        toast.success(`Item status updated to ${status}`);
        setItems((prev) =>
          prev.map((i) => (i._id === itemId ? { ...i, status } : i))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update item status');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to permanently delete this inappropriate menu item?')) return;

    setActionId(itemId);
    try {
      const res = await api.delete(`/admin/menu-items/${itemId}`);
      if (res.data.success) {
        toast.success('Menu item deleted permanently');
        setItems((prev) => prev.filter((i) => i._id !== itemId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setActionId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Menu Items Moderation
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Review incoming vendor pizzas, approve quality items, or reject inappropriate submissions
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pizza by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['all', 'pending', 'approved', 'rejected', 'inactive'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-pizza-600 text-white shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <PizzaLoader message="Loading menu items for moderation..." />
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-sm bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
              No menu items found for the selected filter.
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      <th className="py-4 px-6">Item & Vendor</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100'}
                              alt={item.itemName}
                              className="w-12 h-12 rounded-xl object-cover bg-stone-100"
                            />
                            <div>
                              <p className="font-bold text-stone-900 dark:text-white">{item.itemName}</p>
                              <p className="text-xs text-stone-400 flex items-center gap-1">
                                <ChefHat className="w-3 h-3" />
                                {item.vendor?.businessName || item.vendor?.name} • {item.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-xs text-stone-600 dark:text-stone-300">
                          {item.category}
                        </td>

                        <td className="py-4 px-6 font-extrabold text-pizza-600">
                          {formatPrice(item.price)}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              item.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                                : item.status === 'pending'
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                                : item.status === 'rejected'
                                ? 'bg-red-50 text-red-600 dark:bg-red-950/60'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'approved')}
                                disabled={actionId === item._id}
                                title="Approve Item"
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}

                            {item.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'rejected')}
                                disabled={actionId === item._id}
                                title="Reject Item"
                                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              disabled={actionId === item._id}
                              title="Delete Item"
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
