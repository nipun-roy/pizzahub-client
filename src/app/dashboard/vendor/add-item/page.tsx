'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { MenuCategory } from '@/types';
import { Upload, PlusCircle, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES: MenuCategory[] = [
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

export default function AddMenuItemPage() {
  const router = useRouter();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('Classic Pizzas');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitError, setLimitError] = useState(false);

  // ImgBB Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbKey) {
      toast.info('No ImgBB API key found in env. You can enter an image URL directly or upload.');
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Upload to ImgBB
      const apiKey = imgbbKey || '6d207e02198a847aa98d0a2a901485a5'; // Public fallback or project key
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        toast.success('Image successfully uploaded to ImgBB!');
      } else {
        toast.error('ImgBB upload error. You can paste an image URL instead.');
      }
    } catch (err) {
      toast.error('Failed to upload image to ImgBB. Please paste an image URL directly.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('At least one item image is required');
      return;
    }

    setSubmitting(true);
    setLimitError(false);

    try {
      const res = await api.post('/menu', {
        itemName,
        category,
        description,
        price: parseFloat(price),
        location,
        images: [imageUrl],
      });

      if (res.data.success) {
        toast.success('Pizza menu item submitted for admin review!');
        router.push('/dashboard/vendor/menu');
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.limitReached) {
        setLimitError(true);
        toast.error(err.response.data.message);
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit menu item');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout>
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Add New Menu Item
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Submit a handcrafted pizza or side. It will be reviewed by admin before going live.
            </p>
          </div>

          {/* Free Tier Limit Notification if reached */}
          {limitError && (
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-200">
                  Free Tier Limit Reached (Max 3 Items)
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  Your current Free Plan only permits up to 3 active or pending menu items. Upgrade to the Premium subscription to publish unlimited menu items and get the verified restaurant badge!
                </p>
                <Link
                  href="/dashboard/vendor/subscription"
                  className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Upgrade to Premium ($19.99) →
                </Link>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6"
          >
            {/* Item Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                Pizza / Item Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Truffle Forest Mushroom Pie"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MenuCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.99"
                  required
                  placeholder="14.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                Baking Area / City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Downtown Central, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                Description & Ingredients *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe crust fermentation, cheese type, sauce, and secret toppings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 resize-none"
              />
            </div>

            {/* Item Image Upload (ImgBB) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                Item Image (ImgBB Upload Required) *
              </label>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-200 transition-colors border border-stone-200 dark:border-stone-700">
                    <Upload className="w-4 h-4 text-pizza-600" />
                    <span>{uploadingImage ? 'Uploading to ImgBB...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <span className="text-xs text-stone-400">or paste direct image URL below</span>
                </div>

                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    placeholder="https://i.ibb.co/... or https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
                  />
                </div>

                {/* Image Preview */}
                {imageUrl && (
                  <div className="w-32 h-24 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 relative">
                    <img src={imageUrl} alt="Item Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-pizza-600 hover:bg-pizza-700 active:scale-[0.99] text-white shadow-lg shadow-pizza-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{submitting ? 'Submitting Item...' : 'Submit Item for Admin Approval'}</span>
            </button>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
