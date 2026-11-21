'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuItem } from '@/types';
import { api } from '@/lib/api';
import { MenuCard } from '@/components/menu/MenuCard';
import { FilterBar } from '@/components/menu/FilterBar';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { Pizza, Frown } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (location) params.location = location;
      if (sort) params.sort = sort;

      const res = await api.get('/menu', { params });
      if (res.data.success) {
        setItems(res.data.data || []);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, location, sort]);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setLocation('');
    setSort('');
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-stone-50/50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Fresh from the Oven</span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mt-1">
            Browse Artisanal Pizzas
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Explore authentic handcrafted pizzas, sides, and beverages from our verified restaurant partners.
          </p>
        </div>

        {/* Filter Bar with Search, Category Pills, Location, and Price Sorting */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedCategory={category}
          setSelectedCategory={setCategory}
          location={location}
          setLocation={setLocation}
          sort={sort}
          setSort={setSort}
          onReset={handleReset}
        />

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <PizzaLoader message="Loading delicious menu selections..." size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <Frown className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">No Pizzas Found</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              We couldn't find any menu items matching your search or filters. Try adjusting your search query or reset filters.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-pizza-600 hover:bg-pizza-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-stone-400 font-medium">
              Showing <span className="font-bold text-stone-700 dark:text-stone-200">{items.length}</span> items
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {items.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense fallback={<div className="py-24 flex justify-center"><PizzaLoader message="Loading menu..." size="lg" /></div>}>
      <MenuContent />
    </Suspense>
  );
}
