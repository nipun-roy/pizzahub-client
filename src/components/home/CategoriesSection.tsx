'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pizza, Salad, Flame, Sparkles, Cookie, Wine } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Classic Pizzas',
    description: 'Timeless Margherita, Marinara & Cheese',
    icon: Pizza,
    count: '14+ Varieties',
    bg: 'from-red-500/10 to-pizza-500/20 text-pizza-600',
    slug: 'Classic+Pizzas',
  },
  {
    name: 'Vegetarian Pizzas',
    description: 'Farm-fresh garden veggies & vegan blends',
    icon: Salad,
    count: '9+ Varieties',
    bg: 'from-emerald-500/10 to-green-500/20 text-emerald-600',
    slug: 'Vegetarian+Pizzas',
  },
  {
    name: 'Meat Lovers',
    description: 'Loaded with pepperoni, bacon, sausage & beef',
    icon: Flame,
    count: '12+ Varieties',
    bg: 'from-amber-500/10 to-orange-500/20 text-orange-600',
    slug: 'Meat+Lovers',
  },
  {
    name: 'Specialty / Gourmet Pizzas',
    description: 'Truffle oil, prosciutto, burrata & artisanal crusts',
    icon: Sparkles,
    count: '8+ Varieties',
    bg: 'from-purple-500/10 to-pink-500/20 text-purple-600',
    slug: 'Specialty+%2F+Gourmet+Pizzas',
  },
  {
    name: 'Sides & Appetizers',
    description: 'Garlic knots, cheesy breadsticks & wings',
    icon: Cookie,
    count: '10+ Items',
    bg: 'from-yellow-500/10 to-amber-500/20 text-amber-600',
    slug: 'Sides+%26+Appetizers',
  },
  {
    name: 'Beverages & Desserts',
    description: 'Craft sodas, Italian tiramisu & cannolis',
    icon: Wine,
    count: '7+ Items',
    bg: 'from-blue-500/10 to-cyan-500/20 text-blue-600',
    slug: 'Beverages+%26+Desserts',
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 sm:py-24 bg-stone-50/70 dark:bg-stone-900/40 border-y border-stone-200/60 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Explore by Category</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-1">
            Craving Something Specific?
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
            Filter our entire culinary catalog by your favorite pizza style, savory appetizers, or sweet Italian treats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/menu?category=${cat.slug}`}
                  className="flex items-start gap-4 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-lg hover:border-pizza-300 dark:hover:border-pizza-800 transition-all group block h-full"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white group-hover:text-pizza-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {cat.description}
                    </p>
                    <span className="inline-block mt-2 text-[11px] font-semibold text-pizza-600 dark:text-pizza-400">
                      {cat.count} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
