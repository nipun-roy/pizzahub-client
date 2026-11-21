import React from 'react';
import Link from 'next/link';
import { Pizza, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-stone-50/50 dark:bg-stone-950">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-stone-900 p-8 sm:p-12 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
        <div className="w-20 h-20 rounded-3xl bg-pizza-50 dark:bg-pizza-950 text-pizza-600 flex items-center justify-center mx-auto shadow-inner">
          <Pizza className="w-10 h-10 animate-pizza-spin" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-pizza-600">404</span>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">
            Slice Not Found!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Oops! It seems this slice was eaten or the page you are looking for has been moved or removed from our oven.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/menu"
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
