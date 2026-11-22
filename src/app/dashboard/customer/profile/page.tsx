'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getStoredUser, setAuthSession, getStoredToken } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { User, Mail, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { toast } from 'sonner';

export default function CustomerProfilePage() {
  const user = getStoredUser();
  const token = getStoredToken();

  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch('/auth/profile', {
        name,
        image: image || undefined,
      });

      if (res.data.success && user && token) {
        const updated = {
          ...user,
          name: res.data.data.name,
          image: res.data.data.image,
        };
        setAuthSession(token, updated);
        toast.success('Profile updated successfully');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['customer', 'vendor']}>
      <DashboardLayout>
        <div className="max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Manage your personal information and contact preferences
            </p>
          </div>

          <form
            onSubmit={handleSave}
            className="p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6"
          >
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <UserAvatar name={name} image={image} size="xl" shape="rounded" />
              <div>
                <p className="font-bold text-sm text-stone-900 dark:text-white">{name}</p>
                <p className="text-xs text-stone-400 capitalize">{user?.role} Account</p>
              </div>
            </div>

            {/* Read-Only Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-500 text-sm cursor-not-allowed"
              />
            </div>

            {/* Editable Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pizza-600" />
                Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            {/* Editable Profile Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-pizza-600" />
                Profile Picture URL
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
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
