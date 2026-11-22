'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pizza, Mail, Lock, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { setAuthSession } from '@/lib/auth-client';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { GoogleAuthButton } from '@/components/common/GoogleAuthButton';
import { toast } from 'sonner';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/signin', { email, password });
      if (res.data.success) {
        setAuthSession(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);

        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          window.location.href = `/dashboard/${res.data.user.role}`;
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Demo / Simulated Google OAuth Sync
    const demoGoogleEmail = 'google.user@example.com';
    const demoGoogleName = 'Google Pizza Lover';
    try {
      const res = await api.post('/auth/google', {
        email: demoGoogleEmail,
        name: demoGoogleName,
        role: 'customer',
      });
      if (res.data.success) {
        setAuthSession(res.data.token, res.data.user);
        toast.success(`Signed in with Google as ${res.data.user.name}`);
        router.push(returnUrl || `/dashboard/${res.data.user.role}`);
      }
    } catch (err: any) {
      toast.error('Google Sign-In failed');
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-pizza-600 text-white flex items-center justify-center mx-auto shadow-md shadow-pizza-600/30">
          <Pizza className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
          Sign In to Pizza<span className="text-pizza-600">Hub</span>
        </h2>
        <p className="text-xs text-stone-500">
          Enter your credentials to access your orders and dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-pizza-600 hover:bg-pizza-700 active:scale-[0.98] transition-all shadow-md shadow-pizza-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Google OAuth Alternative */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200 dark:border-stone-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-stone-900 px-3 text-stone-400 font-semibold">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton returnUrl={returnUrl || undefined} />

      {/* Footer Redirect */}
      <p className="text-center text-xs text-stone-500">
        Don't have an account?{' '}
        <Link href="/sign-up" className="font-bold text-pizza-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50/50 dark:bg-stone-950">
      <Suspense fallback={<PizzaLoader message="Loading login form..." />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
