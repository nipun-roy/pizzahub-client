'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MenuItem } from '@/types';
import { api } from '@/lib/api';
import { getStoredUser } from '@/lib/auth-client';
import { formatPrice } from '@/lib/utils';
import { OrderModal } from '@/components/menu/OrderModal';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { MapPin, ChefHat, Sparkles, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const currentUser = getStoredUser();

  useEffect(() => {
    async function fetchItem() {
      if (!id) return;
      try {
        const res = await api.get(`/menu/${id}`);
        if (res.data.success && res.data.data) {
          const itemData: MenuItem = res.data.data;
          setItem(itemData);
          if (itemData.images && itemData.images.length > 0) {
            setSelectedImage(itemData.images[0]);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Menu item not found or is currently unavailable.');
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleOrderClick = () => {
    if (!currentUser) {
      toast.info('Please sign in to place an order');
      router.push(`/sign-in?returnUrl=${encodeURIComponent(`/menu/${id}`)}`);
      return;
    }

    if (currentUser.role === 'admin') {
      toast.error('Admins cannot place customer food orders');
      return;
    }

    if (item && item.vendorId === currentUser.id) {
      toast.error('Vendors cannot place orders for their own menu items');
      return;
    }

    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <PizzaLoader message="Preparing menu item details..." size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto my-24 p-8 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950 text-red-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Item Not Available</h2>
        <p className="text-sm text-stone-500">{error || 'The requested pizza item could not be retrieved.'}</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-pizza-600 hover:bg-pizza-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>
      </div>
    );
  }

  const imagesList = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'];

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-stone-50/40 dark:bg-stone-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Full Menu
        </Link>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-100 dark:border-stone-800 relative">
              <img
                src={selectedImage || imagesList[0]}
                alt={item.itemName}
                className="w-full h-full object-cover transition-all"
              />
              {item.isFeatured && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Specialty
                </span>
              )}
            </div>

            {/* Thumbnail Carousel / List if multiple images */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === img ? 'border-pizza-600 scale-95 ring-2 ring-pizza-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${item.itemName} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Section */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-pizza-50 dark:bg-pizza-950 text-pizza-600 border border-pizza-100 dark:border-pizza-900">
                  {item.category}
                </span>
                <span className="text-3xl font-black text-pizza-600">
                  {formatPrice(item.price)}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                {item.itemName}
              </h1>

              <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>

              {/* Vendor & Location Highlights */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-pizza-600">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium">Prepared by Kitchen</p>
                    <p className="text-sm font-bold text-stone-900 dark:text-white">
                      {item.vendor?.businessName || item.vendor?.name || 'Local Artisan Pizzeria'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium">Baking Location / Area</p>
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordering CTA */}
            <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={handleOrderClick}
                className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-pizza-600 hover:bg-pizza-700 active:scale-[0.99] transition-all shadow-xl shadow-pizza-600/25 flex items-center justify-center gap-2"
              >
                Order This Pizza Now
              </button>
              <p className="text-center text-xs text-stone-400 mt-2">
                Specify your delivery date and address on the next step
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal Component */}
      <OrderModal
        item={item}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
