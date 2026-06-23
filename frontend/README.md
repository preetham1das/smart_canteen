# 🍽️ NexGen Smart Canteen System

A full-stack Smart Canteen System built with **Next.js 16 (App Router)**, **Tailwind CSS**, **MongoDB (in-memory)**, and **NextAuth.js**. Implements a digital token-based pickup system — no QR codes needed.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎟️ Digital Token System | Unique tokens generated per order, live status tracking |
| 📺 Public Display Screen | Big-screen board showing Preparing & Ready tokens in real-time |
| 📋 Kitchen Display System | Staff dashboard with per-station order cards & one-click status updates |
| 🗓️ Pre-Order Scheduling | Customers pick a future pickup time |
| 🔥 Trending Items | Menu shows trending dishes with 🔥 badge |
| 💰 Dynamic Pricing | 20% off-peak discount (before 11 AM / after 3 PM) |
| 📊 Admin Dashboard | Revenue charts, peak hour analysis, AI demand forecast, order table |
| 🏆 Gamification | Reward points on every order + leaderboard |
| 🔐 Role-Based Auth | Admin / Staff / Customer — enforced at middleware level |
| 🧠 AI Demand Prediction | Simulated 6-hour order demand forecast in Admin analytics |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- No MongoDB install required (uses in-memory MongoDB automatically)

### Install & Run
```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

---

## 🗄️ Seed Sample Data

After starting the server, visit:

```
http://localhost:3000/api/seed
```

This populates 9 menu items and 4 sample orders. Only runs once (idempotent).

---

## 👤 Demo Accounts

| Role | Username | Password | Access |
|---|---|---|---|
| 🛡️ Admin | `admin` | `password123` | All pages + analytics |
| 👨‍🍳 Staff | `staff` | `password123` | Kitchen Display |
| 🧑‍🎓 Customer | `jane` | `password123` | Menu + Token Tracking |

> 💡 On the Login page, click any of the three demo account buttons to auto-fill credentials instantly.

---

## 📂 Project Structure

```
frontend/
├── app/
│   ├── page.js              # Landing / Hub (role-aware)
│   ├── login/page.js        # Login with demo accounts
│   ├── menu/page.js         # Customer menu + cart + checkout
│   ├── track/[token]/       # Live order status tracker
│   ├── kitchen/page.js      # Kitchen Display System (KDS)
│   ├── display/page.js      # Public token announcement board
│   ├── admin/page.js        # Admin analytics dashboard
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth credentials
│       ├── menu/                # GET all items, POST new item
│       ├── menu/[id]/           # PATCH / DELETE item
│       ├── orders/              # GET orders, POST new order
│       ├── orders/[id]/         # GET by token, PATCH status
│       ├── analytics/           # Admin analytics data
│       ├── leaderboard/         # Reward points leaderboard
│       └── seed/                # Database seeding
├── components/
│   ├── AuthProvider.jsx     # NextAuth session wrapper
│   └── ui/
│       ├── Button.jsx
│       └── Input.jsx
├── lib/
│   ├── db.js                # MongoDB connection (in-memory fallback)
│   └── utils.js             # cn() tailwind helper
├── models/
│   ├── User.js
│   ├── MenuItem.js
│   └── Order.js
├── middleware.js            # Route protection by role
└── .env.local               # NEXTAUTH_SECRET + optional MongoDB URI
```

---

## 🗃️ Database Schema

### User
```js
{ name, username, password, role: "admin|staff|customer", rewardPoints }
```

### MenuItem
```js
{ name, category: "snacks|meals|beverages", price, inStock, isTrending, preparationTime, image }
```

### Order
```js
{
  user, items: [{ menuItem, quantity }],
  status: "Pending|Preparing|Ready|Completed",
  tokenNumber,   // e.g. "T-103"
  totalAmount,
  scheduledPickupTime   // optional pre-order time
}
```

---

## 🌐 Pages Overview

| URL | Role | Description |
|---|---|---|
| `/` | All | Hub / Landing page |
| `/login` | Public | Credentials + demo login |
| `/menu` | Customer | Browse, filter, cart, schedule, checkout |
| `/track/[token]` | Customer | Live token status + order summary |
| `/kitchen` | Staff/Admin | KDS with status controls |
| `/display` | Public | Big-screen Preparing/Ready board |
| `/admin` | Admin | Analytics, charts, menu management |

---

## 🔑 Fixing JWT Session Errors

If you see `JWT_SESSION_ERROR` in the console:
1. Open DevTools → Application → Cookies → `localhost:3000`
2. Delete all cookies
3. Refresh and log in again

This happens when a stale session cookie from a previous secret is in the browser.

---

## ☁️ Production MongoDB

To use a real MongoDB database, update `.env.local`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart_canteen
```

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB via Mongoose (in-memory fallback with `mongodb-memory-server`)
- **Auth**: NextAuth.js (Credentials provider, JWT strategy)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: SWR (polling every 3–5s for live updates)
