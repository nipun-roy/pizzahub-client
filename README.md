# PizzaHub — Frontend Client Application (Assignment 9 - Category: 009)

PizzaHub is an authentic, multi-role pizza ordering and delivery platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. It connects pizza lovers with verified local artisanal pizzerias, allowing customers to explore custom menus, track order timelines, and place food orders while empowering restaurant vendors with catalog controls, Stripe subscriptions, and incoming order management.

---

## 🚀 Live Site & Repositories
- **Live Client Application**: [https://pizzahub-client.vercel.app](https://pizzahub-client.vercel.app)
- **Live Backend Server**: [https://pizzahub-server.onrender.com](https://pizzahub-server.onrender.com)
- **Client GitHub Repository**: [https://github.com/nipun-roy/pizzahub-client](https://github.com/nipun-roy/pizzahub-client)
- **Server GitHub Repository**: [https://github.com/nipun-roy/pizzahub-server](https://github.com/nipun-roy/pizzahub-server)

## 👤 Admin & Test Credentials (Live Site)
- **Admin Email**: `admin@pizzahub.com`
- **Admin Password**: `Admin@123456`
- **Stripe Test Card**: `4242 4242 4242 4242` (Any future expiration date, any 3-digit CVC, postal code `12345`)

---

## 🍕 Key Features & System Capabilities

### 1. Multi-Role Authentication & Route Security
- **Better Auth & JWT Client**: Persistent session hydration preventing reload redirects on protected routes.
- **Role-Based Portals**:
  - **Customer**: Explore pizzas, place orders with delivery date and address, track live order status timeline, cancel pending orders, update customer profile.
  - **Vendor**: Manage pizzeria profile, add menu items with ImgBB file uploads, update availability, accept or reject incoming customer orders, manage Stripe Premium subscription (Free tier max 3 active items vs Premium unlimited).
  - **Admin**: Comprehensive platform dashboard with user statistics, search and filter users, block/unblock accounts, approve/reject pending menu items, view immutable Stripe transaction logs.

### 2. High-Performance Artisanal Pizza UI
- Warm pizza palette (rich tomato reds, golden crust amber, ivory cream).
- Uniform card heights and image aspect ratios for consistent browsing.
- Framer Motion animations with floating pizza hero banner and interactive category cards.
- Modern **X** logo for social media links.
- Rich toast notifications with Sonner (no intrusive browser `alert()`).

---

## 🏆 Challenge Requirements Implementation Notes

### 1. Advanced Search, Filtering, and Sorting Flow
- **Implementation**: Handled in `/menu` via dynamic query synchronization with the Express backend (`/api/menu?search=&category=&location=&sort=price_asc`).
- **Debounced Inputs**: Live search input with 300ms debounce for responsive typing.
- **Category Filter Pills**: Fast category filtering (Classic Pizzas, Vegetarian Pizzas, Meat Lovers, Specialty / Gourmet, Sides & Appetizers, Beverages & Desserts).
- **Price Sorting**: Ascending (`price_asc`) and Descending (`price_desc`) price sorting.

### 2. JWT Verification Middleware Flow
- Tokens are automatically attached to outgoing Axios requests via request interceptors (`Authorization: Bearer <token>`).
- If an API returns `401 Unauthorized`, the client cleanly clears invalid session data and redirects the user to `/sign-in?returnUrl=...`.
- `AuthGuard` provides persistent session hydration, eliminating the common bug where reloading a private route prematurely kicks the user to login.

---

## 🌟 Optional Standout Features

### 1. Order Status Timeline Component
- Located in Customer Orders (`/dashboard/customer/orders`) and Vendor order cards.
- Visually guides the user through the order stages:
  - `Order Placed` ➔ `Accepted` ➔ `In the Oven` ➔ `On the Way / Delivered`.
  - Includes dedicated states for cancelled and rejected orders.

### 2. Dark & Light Mode Theme Toggle
- Built using `next-themes` and Tailwind CSS `class` mode.
- Accessible directly from the navigation bar, featuring smooth rotating Sun and Moon icons and persistent local storage preference.

---

## 🛠️ Technology Stack (Dependencies)

- **Framework**: `next: ^14.2.20` (App Router), `react: ^18.3.1`, `react-dom: ^18.3.1`
- **Language**: `typescript: ^5.7.3`
- **Styling**: `tailwindcss: ^3.4.17`, `postcss: ^8.5.2`, `autoprefixer: ^10.4.20`
- **Icons**: `lucide-react: ^0.468.0`
- **Animations**: `framer-motion: ^11.15.0`
- **Theme**: `next-themes: ^0.4.4`
- **Notifications**: `sonner: ^1.7.1`
- **HTTP Client**: `axios: ^1.7.9`
- **Utilities**: `clsx: ^2.1.1`, `tailwind-merge: ^2.5.5`
- **Authentication**: `better-auth: ^1.1.18`

---

## 🔑 Environment Variables

Create a `.env.local` file modeled after `.env.example`:

| Variable Name | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL for Express REST API (`http://localhost:5000/api`) |
| `NEXT_PUBLIC_SERVER_URL` | Base URL for Backend Server (`http://localhost:5000`) |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for uploading menu item photos |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for checkout sessions |

> ⚠️ **Note**: Environment variable secrets are never pushed to GitHub.

---

## 💻 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nipun-roy/pizzahub-client.git
   cd pizzahub-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Ensure NEXT_PUBLIC_API_URL points to your running pizzahub-server
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.
