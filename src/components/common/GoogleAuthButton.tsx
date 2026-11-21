'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { api } from '@/lib/api';
import { setAuthSession } from '@/lib/auth-client';
import { toast } from 'sonner';

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

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('Google Sign-In failed: No credential received');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
        role,
      });

      if (res.data.success) {
        setAuthSession(res.data.token, res.data.user);
        toast.success(`Welcome to PizzaHub, ${res.data.user.name}!`);

        if (onSuccessRedirect) {
          onSuccessRedirect(res.data.user.role);
        } else if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push(`/dashboard/${res.data.user.role}`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoGoogle = async () => {
    setLoading(true);
    try {
      const demoEmail = `google.foodie.${Date.now().toString().slice(-4)}@gmail.com`;
      const demoName = 'Google Foodie User';

      const res = await api.post('/auth/google', {
        email: demoEmail,
        name: demoName,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role,
      });

      if (res.data.success) {
        setAuthSession(res.data.token, res.data.user);
        toast.success(`Signed in as ${res.data.user.name}`);
        if (onSuccessRedirect) {
          onSuccessRedirect(res.data.user.role);
        } else if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push(`/dashboard/${res.data.user.role}`);
        }
      }
    } catch (err: any) {
      toast.error('Demo Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full flex justify-center overflow-hidden rounded-xl">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error('Google Sign-In dialog closed or failed')}
          useOneTap={false}
          theme="outline"
          size="large"
          width="100%"
          text="continue_with"
          shape="circle"
        />
      </div>

      <button
        type="button"
        onClick={handleDemoGoogle}
        disabled={loading}
        className="text-[11px] font-medium text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors underline underline-offset-2"
      >
        or test with Simulated Google Account
      </button>
    </div>
  );
}
