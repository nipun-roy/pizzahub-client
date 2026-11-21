import { User } from '@/types';
import { api } from './api';

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('pizzahub_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pizzahub_token');
}

export function setAuthSession(token: string, user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pizzahub_token', token);
  localStorage.setItem('pizzahub_user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pizzahub_token');
  localStorage.removeItem('pizzahub_user');
  window.dispatchEvent(new Event('auth-change'));
}

export async function fetchCurrentProfile(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await api.get('/auth/me');
    if (res.data.success && res.data.data) {
      const user: User = {
        id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        image: res.data.data.image,
        role: res.data.data.role,
        isBlocked: res.data.data.isBlocked,
        businessName: res.data.data.businessName,
        subscriptionPlan: res.data.data.subscriptionPlan,
      };
      localStorage.setItem('pizzahub_user', JSON.stringify(user));
      window.dispatchEvent(new Event('auth-change'));
      return user;
    }
    return null;
  } catch (err) {
    return null;
  }
}
