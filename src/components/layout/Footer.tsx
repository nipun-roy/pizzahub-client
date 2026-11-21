import React from 'react';
import Link from 'next/link';
import { Pizza, Mail, Phone, MapPin, Instagram, Facebook, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-pizza-600 text-white flex items-center justify-center shadow-sm">
                <Pizza className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                Pizza<span className="text-pizza-600">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Hot & fresh pizza delivered to your doorstep from premier local artisanal pizzerias. Made with passion, baked to perfection.
            </p>
            {/* Social media links with NEW X LOGO */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="Follow us on X"
              >
                {/* Modern X Logo SVG */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-pizza-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-pizza-600 transition-colors">Browse Full Menu</Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-pizza-600 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-pizza-600 transition-colors">Partner With Us (Vendor)</Link>
              </li>
            </ul>
          </div>

          {/* Pizza Categories */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4">
              Popular Pizzas
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/menu?category=Classic+Pizzas" className="hover:text-pizza-600 transition-colors">Classic Margherita</Link>
              </li>
              <li>
                <Link href="/menu?category=Meat+Lovers" className="hover:text-pizza-600 transition-colors">Spicy Pepperoni & Beef</Link>
              </li>
              <li>
                <Link href="/menu?category=Specialty+%2F+Gourmet+Pizzas" className="hover:text-pizza-600 transition-colors">Truffle Gourmet</Link>
              </li>
              <li>
                <Link href="/menu?category=Vegetarian+Pizzas" className="hover:text-pizza-600 transition-colors">Garden Fresh Veggie</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pizza-600 flex-shrink-0" />
                <span>124 Artisan Ave, Culinary District</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pizza-600 flex-shrink-0" />
                <span>+1 (800) 749-9248</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pizza-600 flex-shrink-0" />
                <span>support@pizzahub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} PizzaHub Inc. All rights reserved.</p>
          <p>Built with Next.js, Better Auth & Express</p>
        </div>
      </div>
    </footer>
  );
}
