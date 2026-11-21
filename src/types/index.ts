export type UserRole = 'customer' | 'vendor' | 'admin';
export type SubscriptionPlan = 'free' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan: SubscriptionPlan;
}

export type MenuCategory =
  | 'Classic Pizzas'
  | 'Vegetarian Pizzas'
  | 'Meat Lovers'
  | 'Specialty / Gourmet Pizzas'
  | 'Sides & Appetizers'
  | 'Beverages & Desserts';

export type MenuItemStatus = 'pending' | 'approved' | 'rejected' | 'inactive';

export interface MenuItem {
  _id: string;
  vendorId: string;
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: MenuItemStatus;
  isFeatured?: boolean;
  createdAt: string;
  vendor?: {
    _id: string;
    name: string;
    businessName?: string;
    email?: string;
    subscriptionPlan?: SubscriptionPlan;
  };
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface Order {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  item?: MenuItem;
  customer?: {
    name: string;
    email: string;
    image?: string;
  };
  vendor?: {
    name: string;
    businessName?: string;
    email?: string;
  };
}

export interface Transaction {
  _id: string;
  vendorId: string;
  plan: 'premium';
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: string;
  createdAt: string;
  vendor?: {
    name: string;
    email: string;
    businessName?: string;
  };
}
