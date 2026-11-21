'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { formatPrice } from '@/lib/utils';
import { Check, X, Calendar, MapPin, MessageSquare, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorCustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/vendor');
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load incoming orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: 'accepted' | 'rejected') => {
    setProcessingId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      if (res.data.success) {
        toast.success(`Order #${orderId.slice(-6)} has been ${status}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Customer Orders
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Review and fulfill incoming pizza orders placed for your kitchen
            </p>
          </div>

          {loading ? (
            <PizzaLoader message="Loading incoming customer orders..." />
          ) : orders.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">No Orders Received Yet</h3>
              <p className="text-xs text-stone-500">
                When customers order your pizzas, they will appear here for your approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isPending = order.status === 'pending';

                return (
                  <div
                    key={order._id}
                    className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-4">
                        <img
                          src={order.item?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100'}
                          alt={order.item?.itemName || 'Pizza'}
                          className="w-14 h-14 rounded-2xl object-cover bg-stone-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-stone-900 dark:text-white">
                              {order.item?.itemName}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                order.status === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                                  : order.status === 'pending'
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                                  : 'bg-red-50 text-red-600 dark:bg-red-950/60'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Customer: <strong className="text-stone-700 dark:text-stone-300">{order.customer?.name}</strong> ({order.customer?.email})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <span className="text-lg font-black text-pizza-600">
                          {order.item ? formatPrice(order.item.price) : ''}
                        </span>

                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'accepted')}
                              disabled={processingId === order._id}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'rejected')}
                              disabled={processingId === order._id}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-red-50 dark:bg-stone-800 dark:hover:bg-red-950/40 hover:text-red-600 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-stone-400 capitalize">
                            Decision recorded ({order.status})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pizza-600 flex-shrink-0" />
                        <span>Delivery Date: <strong>{order.deliveryDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pizza-600 flex-shrink-0" />
                        <span>Address: <strong>{order.deliveryAddress}</strong></span>
                      </div>
                      {order.message && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-stone-400 flex-shrink-0" />
                          <span className="italic">Note: "{order.message}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
