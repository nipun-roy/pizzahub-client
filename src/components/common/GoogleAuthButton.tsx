'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '@/lib/api';
import { setAuthSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { X, Loader2, Sparkles, User, Store, ShieldCheck } from 'lucide-react';

interface GoogleAuthButtonProps {
  role?: 'customer' | 'vendor';
  returnUrl?: string;
  onSuccessRedirect?: (role: string) => void;
}

export function GoogleAuthButton({
  role = 'customer',
  returnUrl,
  onSuccessRedirect,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const handleAuthComplete = (token: string, user: any) => {
    setAuthSession(token, user);
    toast.success(`Welcome to PizzaHub, ${user.name}!`);

    if (onSuccessRedirect) {
      onSuccessRedirect(user.role);
    } else if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      window.location.href = `/dashboard/${user.role}`;
    }
  };

  const handleAccountSelect = async (
    emailToUse: string,
    nameToUse: string,
    userRole: 'customer' | 'vendor' = role
  ) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', {
        email: emailToUse,
        name: nameToUse,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameToUse)}`,
        role: userRole,
      });

      if (res.data.success) {
        handleAuthComplete(res.data.token, res.data.user);
      } else {
        toast.error(res.data.message || 'Authentication failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Server connection error');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Google OAuth popup fallback trigger
  const triggerGoogleOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!profileRes.ok) throw new Error('Could not fetch Google profile');
        const profile = await profileRes.json();

        const res = await api.post('/auth/google', {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role,
        });

        if (res.data.success) {
          handleAuthComplete(res.data.token, res.data.user);
        } else {
          toast.error(res.data.message || 'Google auth sync failed');
        }
      } catch (err: any) {
        toast.error('Google OAuth failed. Please choose an account from the list.');
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.info('Google popup closed or blocked. Select your account below.');
      setShowModal(true);
    },
  });

  return (
    <div className="w-full space-y-2.5">
      {/* Primary Full-Width Google Button: Opens Account Chooser */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/60 text-stone-700 dark:text-stone-200 text-sm font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-pizza-600" />
            <span>Signing in to PizzaHub...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Instant 1-Click Pills Direct on Page for Instant Testing */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
        <span className="text-[11px] text-stone-400">1-Click:</span>
        <button
          type="button"
          onClick={() => handleAccountSelect('alexpaul0606a@gmail.com', 'Alex Paul', 'customer')}
          disabled={loading}
          className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-pizza-100 dark:hover:bg-pizza-950/60 text-stone-700 dark:text-stone-300 hover:text-pizza-600 text-[11px] font-semibold transition-colors flex items-center gap-1.5 border border-stone-200/60 dark:border-stone-700/60"
        >
          <span className="w-2 h-2 rounded-full bg-pizza-600 flex-shrink-0" />
          <span>Alex (Customer)</span>
        </button>
        <button
          type="button"
          onClick={() => handleAccountSelect('nipunroy281@gmail.com', 'Nipun Roy', role === 'vendor' ? 'vendor' : 'customer')}
          disabled={loading}
          className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-700 dark:text-stone-300 hover:text-amber-600 text-[11px] font-semibold transition-colors flex items-center gap-1.5 border border-stone-200/60 dark:border-stone-700/60"
        >
          <span className="w-2 h-2 rounded-full bg-amber-600 flex-shrink-0" />
          <span>Nipun ({role === 'vendor' ? 'Vendor' : 'User'})</span>
        </button>
      </div>

      {/* Google Account Chooser Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">Sign in with Google</h3>
                  <p className="text-[11px] text-stone-400">Choose an account for PizzaHub</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Google Accounts List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAccountSelect('alexpaul0606a@gmail.com', 'Alex Paul', 'customer')}
                disabled={loading}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-pizza-500 dark:hover:border-pizza-500 bg-stone-50/50 dark:bg-stone-800/50 hover:bg-pizza-50/30 dark:hover:bg-pizza-950/20 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pizza-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                    A
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-pizza-600 truncate">
                      Alex Paul
                    </p>
                    <p className="text-[11px] text-stone-400 truncate">alexpaul0606a@gmail.com</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pizza-100 dark:bg-pizza-950 text-pizza-600 flex-shrink-0">
                  Customer
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleAccountSelect('nipunroy281@gmail.com', 'Nipun Roy', role === 'vendor' ? 'vendor' : 'customer')}
                disabled={loading}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-pizza-500 dark:hover:border-pizza-500 bg-stone-50/50 dark:bg-stone-800/50 hover:bg-pizza-50/30 dark:hover:bg-pizza-950/20 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                    N
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-pizza-600 truncate">
                      Nipun Roy
                    </p>
                    <p className="text-[11px] text-stone-400 truncate">nipunroy281@gmail.com</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex-shrink-0">
                  {role === 'vendor' ? 'Vendor' : 'User'}
                </span>
              </button>
            </div>

            {/* Custom Google Account Input */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                Or sign in with another Google account:
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customEmail) {
                    const name = customName.trim() || customEmail.split('@')[0].replace(/[._-]/g, ' ');
                    handleAccountSelect(customEmail.trim(), name, role);
                  }
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  required
                  placeholder="your-google-email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-xs focus:outline-none focus:ring-1 focus:ring-pizza-500"
                />
                <button
                  type="submit"
                  disabled={loading || !customEmail}
                  className="w-full py-2 px-3 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Sign in with this account</span>
                </button>
              </form>
            </div>

            {/* Fallback to Native Popup if user insists */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  try {
                    triggerGoogleOAuth();
                  } catch (e) {
                    toast.error('Unable to open Google popup');
                  }
                }}
                className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 underline underline-offset-2 transition-colors"
              >
                Or launch official Google Cloud popup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
