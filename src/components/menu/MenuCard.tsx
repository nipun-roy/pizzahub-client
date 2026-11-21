'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ChefHat, Sparkles } from 'lucide-react';
import { MenuItem } from '@/types';
import { getStoredUser } from '@/lib/auth-client';
import { formatPrice } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const router = useRouter();
  const user = getStoredUser();

  const handleCardClick = (e: React.MouseEvent) => {
    // If logged out, redirect to sign-in
    if (!user) {
      e.preventDefault();
      router.push(`/sign-in?returnUrl=${encodeURIComponent(`/menu/${item._id}`)}`);
    }
  };

  const primaryImage = item.images && item.images.length > 0
    ? item.images[0]
    : 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-pizza-300 dark:hover:border-pizza-900 transition-all duration-300 overflow-hidden">
      {/* Image Container with Fixed Aspect Ratio */}
      <div className="relative w-full h-48 overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={primaryImage}
          alt={item.itemName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-200 backdrop-blur-sm shadow-sm">
            {item.category}
          </span>
          {item.isFeatured && (
            <span className="px-2 py-1 text-xs font-bold rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 text-sm font-extrabold rounded-2xl bg-pizza-600 text-white shadow-md">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>

      {/* Card Content with Flex-1 to ensure equal height */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-stone-900 dark:text-white group-hover:text-pizza-600 transition-colors line-clamp-1">
            {item.itemName}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/80 space-y-3">
          {/* Vendor and Location Info */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5 truncate max-w-[140px]">
              <ChefHat className="w-3.5 h-3.5 text-pizza-500 flex-shrink-0" />
              <span className="truncate">{item.vendor?.businessName || item.vendor?.name || 'Local Kitchen'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/menu/${item._id}`}
            onClick={handleCardClick}
            className="w-full block py-2.5 px-4 text-center text-sm font-semibold text-white bg-pizza-600 hover:bg-pizza-700 active:scale-[0.98] rounded-xl shadow-sm transition-all shadow-pizza-500/20"
          >
            View Details & Order
          </Link>
        </div>
      </div>
    </div>
  );
}
