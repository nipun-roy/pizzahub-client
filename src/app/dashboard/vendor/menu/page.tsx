'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { MenuItem } from '@/types';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { formatPrice } from '@/lib/utils';
import { PlusCircle, Trash2, Edit2, CheckCircle2, Clock, XCircle, Power, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorMenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const fetchItems = async () => {
    try {
      const res = await api.get('/menu/vendor/my-items');
      if (res.data.success) {
        setItems(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load your menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await api.delete(`/menu/${itemId}`);
      if (res.data.success) {
        toast.success('Menu item deleted');
        setItems((prev) => prev.filter((i) => i._id !== itemId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleToggleStatus = async (item: MenuItem) => {
    const nextStatus = item.status === 'approved' ? 'inactive' : 'approved';
    try {
      const res = await api.patch(`/menu/${item._id}`, { status: nextStatus });
      if (res.data.success) {
        toast.success(`Item is now ${nextStatus}`);
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, status: nextStatus } : i))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update item availability');
    }
  };

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                My Menu Items
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                Manage your kitchen catalog, active availability, and review statuses
              </p>
            </div>
            <Link
              href="/dashboard/vendor/add-item"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-600/20 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Item</span>
            </Link>
          </div>

          {loading ? (
            <PizzaLoader message="Loading your menu items..." />
          ) : items.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-4">
              <UtensilsCrossed className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">No Menu Items Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You haven't published any pizzas yet. Add your first item to start receiving orders!
              </p>
              <Link
                href="/dashboard/vendor/add-item"
                className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold bg-pizza-600 text-white"
              >
                Add Your First Pizza
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      <th className="py-4 px-6">Pizza Item</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Review Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
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
                              <p className="text-xs text-stone-400 truncate max-w-[200px]">{item.description}</p>
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
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              item.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                                : item.status === 'pending'
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                                : item.status === 'rejected'
                                ? 'bg-red-50 text-red-600 dark:bg-red-950/60'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800'
                            }`}
                          >
                            {item.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                            {item.status === 'pending' && <Clock className="w-3 h-3" />}
                            {item.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            <span>{item.status}</span>
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.status !== 'rejected' && (
                              <button
                                onClick={() => handleToggleStatus(item)}
                                title={item.status === 'approved' ? 'Mark Inactive' : 'Mark Active'}
                                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                              >
                                <Power className={`w-4 h-4 ${item.status === 'approved' ? 'text-emerald-500' : 'text-stone-400'}`} />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(item._id)}
                              title="Delete Item"
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
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
