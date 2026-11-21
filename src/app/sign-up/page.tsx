'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pizza, Mail, Lock, User, Store, ArrowRight, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { setAuthSession } from '@/lib/auth-client';
import { UserRole } from '@/types';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate password rules: min 6 chars, 1 uppercase, 1 lowercase
  const isPasswordValid =
    password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Password must be at least 6 characters with one uppercase and one lowercase letter');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/signup', {
        name,
        email,
        password,
        image: image || undefined,
        role,
        businessName: role === 'vendor' ? businessName : undefined,
      });

      if (res.data.success) {
        setAuthSession(res.data.token, res.data.user);
        toast.success('Account created successfully! Welcome to PizzaHub.');
        router.push(`/dashboard/${res.data.user.role}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const demoGoogleEmail = `user.${Date.now()}@example.com`;
    const demoGoogleName = 'New Google Foodie';
    try {
      const res = await api.post('/auth/google', {
        email: demoGoogleEmail,
        name: demoGoogleName,
        role,
      });
      if (res.data.success) {
        setAuthSession(res.data.token, res.data.user);
        toast.success(`Account registered via Google!`);
        router.push(`/dashboard/${res.data.user.role}`);
      }
    } catch (err: any) {
      toast.error('Google Sign-Up failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50/50 dark:bg-stone-950">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-pizza-600 text-white flex items-center justify-center mx-auto shadow-md shadow-pizza-600/30">
            <Pizza className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
            Join Pizza<span className="text-pizza-600">Hub</span>
          </h2>
          <p className="text-xs text-stone-500">
            Create an account as a Foodie Customer or Restaurant Vendor
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'customer'
                ? 'bg-white dark:bg-stone-900 text-pizza-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('vendor')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'vendor'
                ? 'bg-white dark:bg-stone-900 text-pizza-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Restaurant Vendor</span>
          </button>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Marco Polo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>

          {role === 'vendor' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                Pizzeria / Business Name *
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Napoli Woodfired Pies"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="marco@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Password * (Min 6 chars, 1 uppercase, 1 lowercase)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Secret123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                  password && !isPasswordValid
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-stone-200 dark:border-stone-800 focus:ring-pizza-500'
                } bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {password && !isPasswordValid && (
              <p className="text-[11px] text-red-500 mt-1">
                Password must have at least 6 characters, 1 uppercase, and 1 lowercase letter.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Profile Image URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-pizza-600 hover:bg-pizza-700 active:scale-[0.98] transition-all shadow-md shadow-pizza-600/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google OAuth Alternative */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-stone-900 px-3 text-stone-400 font-semibold">Or sign up with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          type="button"
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign Up with Google ({role})</span>
        </button>

        <p className="text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-bold text-pizza-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
