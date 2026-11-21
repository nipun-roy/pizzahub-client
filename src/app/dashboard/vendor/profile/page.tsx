'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getStoredUser, setAuthSession, getStoredToken } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { User, Store, Mail, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorProfilePage() {
  const user = getStoredUser();
  const token = getStoredToken();

  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [image, setImage] = useState(user?.image || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/auth/profile', {
        name,
        businessName,
        image: image || undefined,
      });

      if (res.data.success && user && token) {
        const updated = {
          ...user,
          name: res.data.data.name,
          businessName: res.data.data.businessName,
          image: res.data.data.image,
        };
        setAuthSession(token, updated);
        toast.success('Restaurant profile updated successfully');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout>
        <div className="max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Restaurant Profile Settings
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Update your kitchen branding, owner name, and storefront details
            </p>
          </div>

          <form
            onSubmit={handleSave}
            className="p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6"
          >
            {/* Business Logo Preview */}
            <div className="flex items-center gap-4">
              {image ? (
                <img src={image} alt={businessName || name} className="w-16 h-16 rounded-2xl object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-pizza-100 dark:bg-pizza-950 text-pizza-600 flex items-center justify-center font-bold text-2xl">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-sm text-stone-900 dark:text-white">{businessName || name}</p>
                <p className="text-xs text-stone-400 capitalize">Verified Restaurant Vendor</p>
              </div>
            </div>

            {/* Read-Only Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                Contact Email (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-500 text-sm cursor-not-allowed"
              />
            </div>

            {/* Pizzeria Business Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-pizza-600" />
                Pizzeria / Kitchen Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pizza-600" />
                Owner / Chef Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            {/* Profile Logo URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-pizza-600" />
                Restaurant Logo / Banner URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 rounded-xl font-bold text-sm bg-pizza-600 hover:bg-pizza-700 text-white shadow-md shadow-pizza-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Restaurant Profile'}</span>
            </button>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
