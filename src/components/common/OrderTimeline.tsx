'use client';

import React from 'react';
import { CheckCircle2, Clock, Truck, ChefHat, XCircle } from 'lucide-react';
import { OrderStatus } from '@/types';

interface OrderTimelineProps {
  status: OrderStatus;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900 text-sm">
        <XCircle className="w-5 h-5 flex-shrink-0" />
        <span>This order was <strong>cancelled</strong> by the customer.</span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2 p-3 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl border border-stone-200 dark:border-stone-800 text-sm">
        <XCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
        <span>This order was <strong>rejected</strong> by the restaurant.</span>
      </div>
    );
  }

  const steps = [
    { key: 'placed', label: 'Order Placed', icon: Clock, done: true },
    { key: 'accepted', label: 'Accepted', icon: CheckCircle2, done: status === 'accepted' },
    { key: 'baking', label: 'In the Oven', icon: ChefHat, done: status === 'accepted' },
    { key: 'delivery', label: 'On the Way', icon: Truck, done: false },
  ];

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0" />
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.done;
          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                  isCompleted
                    ? 'bg-pizza-600 text-white ring-4 ring-pizza-100 dark:ring-pizza-950'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs mt-1.5 font-medium ${isCompleted ? 'text-pizza-700 dark:text-pizza-400 font-semibold' : 'text-stone-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
