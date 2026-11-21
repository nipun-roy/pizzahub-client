import React from 'react';
import { Search, ChefHat, Bike, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Find Your Cravings',
    description: 'Browse menus from top neighborhood pizzerias, filter by crust or toppings, and discover chef specials.',
  },
  {
    step: '02',
    icon: ChefHat,
    title: 'Baked Fresh to Order',
    description: 'The artisan kitchen accepts your request, stretches fresh sourdough, and slides your pie into a 900°F oven.',
  },
  {
    step: '03',
    icon: Bike,
    title: 'Swift Thermal Delivery',
    description: 'Insulated thermal carriers bring your pizza steaming hot and crispy right to your doorstep on your chosen date.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-stone-50/70 dark:bg-stone-900/40 border-t border-stone-200/60 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-1">
            How PizzaHub Works
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
            From craving to first mouthwatering bite in three seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col items-center text-center group hover:border-pizza-300 dark:hover:border-pizza-800 transition-all"
              >
                <span className="absolute top-6 right-6 text-3xl font-black text-stone-200 dark:text-stone-800 group-hover:text-pizza-100 dark:group-hover:text-pizza-950 transition-colors">
                  {s.step}
                </span>

                <div className="w-16 h-16 rounded-2xl bg-pizza-50 dark:bg-pizza-950/80 text-pizza-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-2">
                  {s.title}
                </h3>

                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
