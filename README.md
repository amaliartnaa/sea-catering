# ✨ SEA Catering Frontend Application

Welcome to the frontend repository for the SEA Catering application! This project provides a user-friendly interface for customers to explore healthy meal plans, customize their orders, and manage their subscriptions. It also features an administrative dashboard for monitoring key business metrics.

This frontend is built with a modern and efficient stack, ensuring a smooth and responsive user experience across devices.

> 🔗 **Backend Repository:** [SEA Catering Backend API](https://github.com/amaliartnaa/sea-catering-be)

---

## 🚀 Technologies Used

- **Next.js**: A React framework for building fast, scalable, and SEO-friendly web applications
- **React**: A JavaScript library for building user interfaces
- **TypeScript**: Adds static typing for improved code quality and maintainability
- **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling
- **shadcn/ui**: Beautiful, accessible UI components built with Radix UI and Tailwind
- **Recharts**: Charting library for data visualization
- **date-fns**: Modern date utility library
- **js-cookie**: Lightweight cookie handling API

---

## 🍽️ Key Features

- **Homepage**: Engaging introduction to SEA Catering services
- **Interactive Navigation**: Seamless user experience with responsive UI
- **Meal Plans**: Browse and interact with meal plans and modal previews
- **Testimonials**: Submit and view customer reviews via carousel
- **Subscription System**:
  - Customizable form with live price updates
  - Secure submission to backend
- **Authentication & Authorization**:
  - Register, login, logout
  - Protected routes (user & admin)
- **User Dashboard**: View/pause/cancel/resume active subscriptions
- **Admin Dashboard**: Business metrics with date range filtering & charts

---

## 🖥️ System Requirements

- **Node.js** (LTS version 18.x or higher recommended)
- **pnpm** (recommended)
- Access to the SEA Catering Backend API (running locally or deployed)

---

## ⚙️ Installation & Local Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/amaliartnaa/sea-catering-fe.git
cd sea-catering-fe
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables Configuration 🔐

Create a `.env.local` file in the project root:

```env
# Environment Variables for SEA Catering Frontend
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
```

### 4. Start Frontend ▶️

```bash
pnpm run dev
```

App will be available at: [http://localhost:3000](http://localhost:3000)

---

## ⚠️ Important Notes for Local Development

- Make sure the **backend** is also running (e.g., `http://localhost:5000`)
- The app uses **HTTP-only cookies** for auth, which can cause issues if switching ports or switching between http/https
- Next.js **rewrites** proxy `/api` to the backend, resolving SameSite issues
- If login doesn't persist after refresh, clear cookies or check `.env` setup

---

## 🔗 API Endpoints Used

| Method | Endpoint                               | Description                              |
| ------ | -------------------------------------- | ---------------------------------------- |
| POST   | `/api/auth/register`                   | Register a new user                      |
| POST   | `/api/auth/login`                      | Log in and receive auth cookie           |
| GET    | `/api/auth/me`                         | Get current logged-in user info          |
| POST   | `/api/auth/logout`                     | Log out and clear session                |
| GET    | `/api/csrf-token`                      | Get CSRF token (for protected actions)   |
| POST   | `/api/subscriptions`                   | Create a new subscription                |
| GET    | `/api/subscriptions/me`                | View subscriptions for logged-in user    |
| PUT    | `/api/subscriptions/:id/pause`         | Pause a subscription                     |
| PUT    | `/api/subscriptions/:id/cancel`        | Cancel a subscription                    |
| PUT    | `/api/subscriptions/:id/resume`        | Resume a subscription                    |
| POST   | `/api/testimonials`                    | Submit a customer testimonial            |
| GET    | `/api/testimonials`                    | View all testimonials                    |
| GET    | `/api/admin/metrics?startDate&endDate` | Get business metrics for admin dashboard |

---

## 🧑‍💻 Guide for Testing Admin Access

1. Stop the backend server: `Ctrl + C`
2. Run Prisma Studio: `pnpm prisma studio`
3. In the **User** table, update the target user's `role` to `admin`
4. Save changes
5. Restart backend: `pnpm run dev`
6. Log out then log in again via frontend → you can now access `/admin/dashboard`
