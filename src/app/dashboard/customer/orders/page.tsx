'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { OrderTimeline } from '@/components/common/OrderTimeline';
import { Calendar, MapPin, ChefHat, MessageSquare, Ban, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/customer');
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this pending pizza order?')) return;

    setCancellingId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        toast.success('Order successfully cancelled');
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: 'cancelled' } : o))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={['customer', 'vendor']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              My Pizza Orders
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Review live order progress and cancellation controls for your orders
            </p>
          </div>

          {loading ? (
            <PizzaLoader message="Fetching your orders..." />
          ) : orders.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">No Orders Found</h3>
              <p className="text-xs text-stone-500">You haven't submitted any pizza orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const canCancel = order.status === 'pending';

                return (
                  <div
                    key={order._id}
                    className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6"
                  >
                    {/* Top Row: Item Details & Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-4">
                        <img
                          src={order.item?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'}
                          alt={order.item?.itemName || 'Pizza Item'}
                          className="w-16 h-16 rounded-2xl object-cover bg-stone-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-lg text-stone-900 dark:text-white">
                              {order.item?.itemName || 'Artisanal Pizza'}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                order.status === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                                  : order.status === 'pending'
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-50 text-red-600 dark:bg-red-950/60'
                                  : 'bg-stone-100 text-stone-600 dark:bg-stone-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                            <span className="flex items-center gap-1">
                              <ChefHat className="w-3.5 h-3.5 text-pizza-500" />
                              {order.vendor?.businessName || order.vendor?.name || 'Kitchen'}
                            </span>
                            <span>•</span>
                            <span>Ordered on {new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                        <span className="text-xl font-black text-pizza-600">
                          {order.item ? formatPrice(order.item.price) : ''}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          ID: #{order._id.slice(-6)}
                        </span>
                      </div>
                    </div>

                    {/* Order Status Timeline Visualization */}
                    <div className="bg-stone-50/70 dark:bg-stone-950/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800/80">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Delivery Status Progress
                      </p>
                      <OrderTimeline status={order.status} />
                    </div>

                    {/* Details Grid & Cancellation Action */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                      <div className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                        <Calendar className="w-4 h-4 text-pizza-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-stone-400 uppercase text-[10px]">Delivery Scheduled</p>
                          <p className="font-bold">{order.deliveryDate}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                        <MapPin className="w-4 h-4 text-pizza-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-stone-400 uppercase text-[10px]">Destination Address</p>
                          <p className="font-bold leading-tight">{order.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-start justify-between md:justify-end gap-2">
                        {order.message && (
                          <div className="flex items-start gap-1.5 text-stone-500">
                            <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-stone-400" />
                            <span className="italic">"{order.message}"</span>
                          </div>
                        )}

                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingId === order._id}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/80 transition-colors flex items-center gap-1.5 self-start disabled:opacity-50"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}</span>
                          </button>
                        )}
                      </div>
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
