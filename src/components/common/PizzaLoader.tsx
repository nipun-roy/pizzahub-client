'use client';

import React from 'react';
import { Pizza } from 'lucide-react';

interface PizzaLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PizzaLoader({ message = 'Baking something fresh & hot...', size = 'md' }: PizzaLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-pizza-500',
    md: 'w-10 h-10 text-pizza-600',
    lg: 'w-16 h-16 text-pizza-600',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative">
        <Pizza className={`${sizeClasses[size]} animate-spin`} style={{ animationDuration: '3s' }} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crust-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-crust-500"></span>
        </span>
      </div>
      {message && <p className="text-sm font-medium text-stone-500 dark:text-stone-400 animate-pulse">{message}</p>}
    </div>
  );
}
