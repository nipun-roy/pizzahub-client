'use client';

import React from 'react';
import { Search, MapPin, ArrowDownUp, RotateCcw } from 'lucide-react';
import { MenuCategory } from '@/types';

interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  onReset: () => void;
}

const CATEGORIES: (MenuCategory | 'All')[] = [
  'All',
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

export function FilterBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  location,
  setLocation,
  sort,
  setSort,
  onReset,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
      {/* Search and Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search by Name */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pizza by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
          />
        </div>

        {/* Filter by Location */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by area / city..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
          />
        </div>

        {/* Sort by Price & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <ArrowDownUp className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer"
            >
              <option value="">Default Order</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <button
            onClick={onReset}
            title="Reset Filters"
            className="p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-pizza-600 text-white shadow-sm shadow-pizza-600/30'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
