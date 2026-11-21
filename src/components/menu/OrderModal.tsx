'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, MessageSquare, Pizza, X } from 'lucide-react';
import { MenuItem } from '@/types';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface OrderModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ item, isOpen, onClose }: OrderModalProps) {
  const router = useRouter();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDate || !deliveryAddress) {
      toast.error('Please specify both a delivery date and address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/orders', {
        itemId: item._id,
        deliveryDate,
        deliveryAddress,
        message,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Order placed successfully! Redirecting to orders...');
        onClose();
        router.push('/dashboard/customer/orders');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit order. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="w-10 h-10 rounded-2xl bg-pizza-600 text-white flex items-center justify-center">
            <Pizza className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Confirm Pizza Order</h2>
            <p className="text-xs text-stone-400">Review your order details and delivery info</p>
          </div>
        </div>

        {/* Item Summary Card */}
        <div className="my-4 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-white">{item.itemName}</h4>
            <p className="text-xs text-stone-500">{item.vendor?.businessName || item.vendor?.name}</p>
          </div>
          <span className="font-extrabold text-base text-pizza-600">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmitOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pizza-600" />
              Delivery Date *
            </label>
            <input
              type="date"
              min={today}
              required
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pizza-600" />
              Delivery Address *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Apartment 4B, 45 West Oak Street, Downtown"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-pizza-600" />
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra crispy crust, please ring bell"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-pizza-600 hover:bg-pizza-700 active:scale-[0.98] text-white transition-all shadow-md shadow-pizza-600/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
