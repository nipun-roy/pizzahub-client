'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  CreditCard,
  User as UserIcon,
  Users,
  ShieldCheck,
  Receipt,
  LogOut,
  Menu,
  X,
  Pizza,
  Sparkles,
} from 'lucide-react';
import { getStoredUser, clearAuthSession } from '@/lib/auth-client';
import { UserRole } from '@/types';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const role: UserRole = user?.role || 'customer';

  const vendorNav: NavItem[] = [
    { label: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
    { label: 'My Menu Items', href: '/dashboard/vendor/menu', icon: UtensilsCrossed },
    { label: 'Add Menu Item', href: '/dashboard/vendor/add-item', icon: PlusCircle },
    { label: 'Customer Orders', href: '/dashboard/vendor/orders', icon: ShoppingBag },
    { label: 'Subscription Plan', href: '/dashboard/vendor/subscription', icon: CreditCard },
    { label: 'Profile Settings', href: '/dashboard/vendor/profile', icon: UserIcon },
  ];

  const customerNav: NavItem[] = [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Orders', href: '/dashboard/customer/orders', icon: ShoppingBag },
    { label: 'Profile Settings', href: '/dashboard/customer/profile', icon: UserIcon },
  ];

  const adminNav: NavItem[] = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Manage Menu Items', href: '/dashboard/admin/menu', icon: ShieldCheck },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'vendor' ? vendorNav : customerNav;

  const handleLogout = () => {
    clearAuthSession();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pizza-600 text-white flex items-center justify-center">
            <Pizza className="w-5 h-5" />
          </div>
          <span className="font-bold text-stone-900 dark:text-white">PizzaHub</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Component */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-stone-100 dark:border-stone-800 hidden md:flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pizza-600 text-white flex items-center justify-center shadow-md shadow-pizza-500/20">
              <Pizza className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
                Pizza<span className="text-pizza-600">Hub</span>
              </span>
              <p className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider">
                {role} Portal
              </p>
            </div>
          </div>

          {/* User Preview & Role Pill */}
          <div className="p-4 mx-3 my-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-800 flex items-center gap-3">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-pizza-100 dark:bg-pizza-950 text-pizza-600 flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-pizza-600 text-white">
                  {role}
                </span>
                {role === 'vendor' && user?.subscriptionPlan === 'premium' && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-500 text-white flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-pizza-600 text-white shadow-sm shadow-pizza-600/30 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            ← Back to Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
