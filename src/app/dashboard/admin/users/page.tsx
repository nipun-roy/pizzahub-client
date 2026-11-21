'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import { User } from '@/types';
import { PizzaLoader } from '@/components/common/PizzaLoader';
import { Search, ShieldAlert, ShieldCheck, User as UserIcon, Store, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const handleToggleBlock = async (userId: string, currentBlocked: boolean, targetName: string) => {
    if (!confirm(`Are you sure you want to ${currentBlocked ? 'unblock' : 'block'} user ${targetName}?`)) {
      return;
    }

    setTogglingId(userId);
    try {
      const res = await api.patch(`/admin/users/${userId}/block`);
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isBlocked: res.data.isBlocked } : u))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user block state');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Manage Registered Users
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Search, filter, and moderate customers and restaurant vendors
            </p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {loading ? (
            <PizzaLoader message="Fetching user directory..." />
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-sm bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
              No registered users matched your criteria.
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Subscription</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                    {users.map((u: any) => {
                      const isTargetAdmin = u.role === 'admin';

                      return (
                        <tr key={u._id || u.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {u.image ? (
                                <img src={u.image} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-pizza-100 dark:bg-pizza-950 text-pizza-600 flex items-center justify-center font-bold text-sm">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.businessName && (
                                    <span className="text-xs text-stone-400 font-normal">({u.businessName})</span>
                                  )}
                                </p>
                                <p className="text-xs text-stone-400">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                              {u.role === 'vendor' && <Store className="w-3 h-3 text-purple-500" />}
                              {u.role === 'customer' && <UserIcon className="w-3 h-3 text-emerald-500" />}
                              {u.role === 'admin' && <Shield className="w-3 h-3 text-pizza-500" />}
                              <span>{u.role}</span>
                            </span>
                          </td>

                          <td className="py-4 px-6 text-xs capitalize text-stone-500 font-medium">
                            {u.role === 'vendor' ? (
                              <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${u.subscriptionPlan === 'premium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-stone-100 text-stone-600'}`}>
                                {u.subscriptionPlan || 'free'}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </td>

                          <td className="py-4 px-6">
                            {u.isBlocked ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/60">
                                <ShieldAlert className="w-3 h-3" /> Blocked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60">
                                <ShieldCheck className="w-3 h-3" /> Active
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            {!isTargetAdmin ? (
                              <button
                                onClick={() => handleToggleBlock(u._id || u.id, u.isBlocked, u.name)}
                                disabled={togglingId === (u._id || u.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                                  u.isBlocked
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300'
                                }`}
                              >
                                {u.isBlocked ? 'Unblock User' : 'Block User'}
                              </button>
                            ) : (
                              <span className="text-xs text-stone-400 italic">Protected Admin</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
