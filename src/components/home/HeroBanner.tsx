'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Sparkles, ShieldCheck, Clock } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-crust-50/40 via-white to-white dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 border-b border-stone-200/60 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pizza-50 dark:bg-pizza-950/60 border border-pizza-200 dark:border-pizza-900 text-pizza-700 dark:text-pizza-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-pizza-500 text-pizza-500 animate-pulse" />
              <span>Wood-Fired & Freshly Baked</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 dark:text-white leading-[1.15]">
              Hot & Fresh <span className="text-pizza-600 underline decoration-crust-400 decoration-wavy">Pizza</span> Delivered to Your Door
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover authentic, handcrafted pizzas from top local artisanal pizzerias. Made with slow-fermented sourdough, fresh mozzarella, and stone-baked to perfection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-pizza-600 hover:bg-pizza-700 active:scale-95 transition-all shadow-lg shadow-pizza-600/30 flex items-center justify-center gap-2 group"
              >
                <span>Explore Pizza Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-center"
              >
                Become a Restaurant Partner
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
                <Clock className="w-4 h-4 text-pizza-600 flex-shrink-0" />
                <span>30-Min Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
                <Sparkles className="w-4 h-4 text-crust-500 flex-shrink-0" />
                <span>Stone Baked</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Verified Quality</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual with Motion Float */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-pizza-500/20 via-crust-400/20 to-pizza-600/10 blur-3xl absolute -z-10" />
            
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800"
            >
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"
                alt="Artisanal Supreme Pizza"
                className="w-full max-w-lg object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-pizza-600">Specialty Pick</p>
                  <p className="text-sm font-extrabold text-stone-900 dark:text-white">Margherita Di Bufala</p>
                </div>
                <span className="px-3 py-1 text-sm font-black bg-pizza-600 text-white rounded-xl shadow-sm">
                  $14.99
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
