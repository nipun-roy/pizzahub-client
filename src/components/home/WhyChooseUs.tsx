import React from 'react';
import { Flame, Clock, Award, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

const BENEFITS = [
  {
    icon: Flame,
    title: 'Stone-Oven Authenticity',
    description: 'Every restaurant on PizzaHub is vetted for genuine high-heat stone and wood-fired oven baking technique.',
  },
  {
    icon: Clock,
    title: 'Guaranteed 30-Minute Speed',
    description: 'Direct kitchen-to-door logistics ensure your pizza arrives bubbling hot with a crisp, never-soggy crust.',
  },
  {
    icon: Award,
    title: 'Curated Artisan Kitchens',
    description: 'We prioritize local, independent pizzerias over industrial chains so you taste genuine craft in every bite.',
  },
  {
    icon: Leaf,
    title: 'Fresh Farm Ingredients',
    description: 'San Marzano tomatoes, fresh Fior Di Latte mozzarella, and pure cold-pressed Italian olive oils.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Vendor Quality',
    description: 'All vendors and menu items undergo strict admin review before appearing on the public platform.',
  },
  {
    icon: HeartHandshake,
    title: 'Direct Restaurant Support',
    description: 'Our fair commission platform empowers local chefs and family-owned restaurants to thrive in the community.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-pizza-600">The PizzaHub Standard</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mt-1">
            Why Choose PizzaHub?
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
            We are not just a food aggregator. We are pizza connoisseurs committed to delivering the ultimate slice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="p-7 rounded-3xl bg-stone-50/70 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 hover:border-pizza-300 dark:hover:border-pizza-800 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-pizza-100 dark:bg-pizza-950/80 text-pizza-600 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
