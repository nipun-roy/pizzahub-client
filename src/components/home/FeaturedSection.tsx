'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MenuItem } from '@/types';
import { api } from '@/lib/api';
import { MenuCard } from '../menu/MenuCard';
import { PizzaLoader } from '../common/PizzaLoader';

const FALLBACK_FEATURED: MenuItem[] = [
  {
    _id: 'sample-1',
    vendorId: 'v1',
    itemName: 'Truffle Mushroom Rustica',
    category: 'Specialty / Gourmet Pizzas',
    description: 'Wild forest mushrooms, black truffle olive oil, creamy mozzarella, and thyme on sourdough crust.',
    price: 18.50,
    location: 'Downtown Core',
    images: ['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'],
    status: 'approved',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    vendor: { _id: 'v1', name: 'Mario Rossi', businessName: "Mario's Wood Oven", subscriptionPlan: 'premium' }
  },
  {
    _id: 'sample-2',
    vendorId: 'v2',
    itemName: 'Fiery Calabrese Pepperoni',
    category: 'Meat Lovers',
    description: 'Spicy artisanal salami, Calabrian chili flakes, hot honey drizzle, and crushed San Marzano tomatoes.',
    price: 16.99,
    location: 'Little Italy',
    images: ['https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600'],
    status: 'approved',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    vendor: { _id: 'v2', name: 'Gino Pizzeria', businessName: "Gino's Authentic Pies", subscriptionPlan: 'premium' }
  },
  {
    _id: 'sample-3',
    vendorId: 'v3',
    itemName: 'Classic Margherita D.O.P',
    category: 'Classic Pizzas',
    description: 'D.O.P San Marzano tomatoes, fresh buffalo mozzarella, fragrant garden basil, and extra virgin olive oil.',
    price: 13.99,
    location: 'Culinary Row',
    images: ['https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600'],
    status: 'approved',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    vendor: { _id: 'v3', name: 'Bella Napoli', businessName: "Bella Napoli Pizzeria", subscriptionPlan: 'free' }
  },
  {
    _id: 'sample-4',
    vendorId: 'v4',
    itemName: 'Mediterranean Garden Delight',
    category: 'Vegetarian Pizzas',
    description: 'Roasted bell peppers, artichoke hearts, kalamata olives, red onions, feta cheese, and fresh oregano.',
    price: 15.50,
    location: 'Westside Market',
    images: ['https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600'],
    status: 'approved',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    vendor: { _id: 'v4', name: 'Green Garden', businessName: "Green Earth Pizza Co.", subscriptionPlan: 'free' }
  },
  {
    _id: 'sample-5',
    vendorId: 'v5',
    itemName: 'BBQ Smoked Brisket Supreme',
    category: 'Meat Lovers',
    description: 'Slow-smoked Texas brisket, smoky barbecue drizzle, crispy shallots, smoked gouda, and cilantro.',
    price: 19.99,
    location: 'Southside Marina',
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'],
    status: 'approved',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    vendor: { _id: 'v5', name: 'Smokehouse Pies', businessName: "The Smokehouse Kitchen", subscriptionPlan: 'premium' }
  },
  {
    _id: 'sample-6',
    vendorId: 'v6',
    itemName: 'Four Cheese Bianca Con Garlic',
    category: 'Classic Pizzas',
    description: 'White base with gorgonzola dolce, aged parmigiano, fontina, roasted garlic confit, and rosemary.',
    price: 16.50,
    location: 'Midtown District',
    images: ['https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600'],
    status: 'approved',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    vendor: { _id: 'v6', name: 'Artisan Crust', businessName: "Artisan Crust Workshop", subscriptionPlan: 'premium' }
  }
];

export function FeaturedSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.get('/menu/featured');
        if (res.data.success && res.data.data && res.data.data.length >= 6) {
          setItems(res.data.data);
        } else {
          // If less than 6 in database yet, merge with curated artisan samples
          const apiItems = res.data.data || [];
          setItems([...apiItems, ...FALLBACK_FEATURED.slice(apiItems.length)]);
        }
      } catch (err) {
        setItems(FALLBACK_FEATURED);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef's Handcrafted Picks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Featured Menu Items
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-2 max-w-xl">
              Freshly approved, top-rated pizzas prepared by premier verified restaurants in your area.
            </p>
          </div>
          <Link
            href="/menu"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-pizza-600 hover:text-pizza-700 transition-colors group"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <PizzaLoader message="Fetching featured pizzas..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.slice(0, 6).map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
