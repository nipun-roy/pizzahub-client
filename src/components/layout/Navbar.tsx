'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Pizza, User as UserIcon, LogOut, LayoutDashboard, Menu as MenuIcon, X, Sparkles } from 'lucide-react';
import { getStoredUser, clearAuthSession } from '@/lib/auth-client';
import { User } from '@/types';
import { ThemeToggle } from '../common/ThemeToggle';
import { UserAvatar } from '../common/UserAvatar';
import { toast } from 'sonner';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const syncUser = () => {
    setUser(getStoredUser());
  };

  useEffect(() => {
    syncUser();
    window.addEventListener('auth-change', syncUser);
    return () => window.removeEventListener('auth-change', syncUser);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setIsDropdownOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/sign-in';
    return `/dashboard/${user.role}`;
  };

  // Hide public storefront navbar inside dashboard pages to avoid double header/logo
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-pizza-600 text-white flex items-center justify-center shadow-md shadow-pizza-500/20 group-hover:scale-105 transition-transform">
            <Pizza className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
            Pizza<span className="text-pizza-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-pizza-600 ${
              pathname === '/' ? 'text-pizza-600 font-semibold' : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={`text-sm font-medium transition-colors hover:text-pizza-600 ${
              pathname.startsWith('/menu') ? 'text-pizza-600 font-semibold' : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Browse Menu
          </Link>

          {/* Role-Specific Shortcuts for Logged-In Users */}
          {user && (
            <Link
              href={getDashboardLink()}
              className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-pizza-600 flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
              {user.role === 'vendor' && user.subscriptionPlan === 'premium' && (
                <span className="px-1.5 py-0.5 text-[10px] bg-amber-500 text-white rounded font-bold uppercase tracking-wider">
                  PRO
                </span>
              )}
            </Link>
          )}
        </nav>

        {/* Action Controls & Auth */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-pizza-500/40 transition-all border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
              >
                <UserAvatar name={user.name} image={user.image} size="sm" />
                <span className="text-sm font-semibold pr-2 text-stone-800 dark:text-stone-200 max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in-50 zoom-in-95"
                >
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-pizza-50 text-pizza-700 dark:bg-pizza-950/60 dark:text-pizza-300">
                      {user.role} {user.subscriptionPlan === 'premium' ? '• Premium' : ''}
                    </span>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-pizza-500" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href={`/dashboard/${user.role}/profile`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-stone-400" />
                    <span>Profile Settings</span>
                  </Link>

                  <div className="border-t border-stone-100 dark:border-stone-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-pizza-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-semibold text-white bg-pizza-600 hover:bg-pizza-700 rounded-xl shadow-sm transition-all hover:shadow-pizza-500/25"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 dark:text-stone-200"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 dark:text-stone-200"
          >
            Browse Menu
          </Link>

          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-semibold text-pizza-600"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 text-base font-semibold text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold rounded-xl border border-stone-300 dark:border-stone-700"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold rounded-xl bg-pizza-600 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
