# SEA Catering Application 🍱

Welcome to the **SEA Catering** project! This repository contains the complete **full-stack application**, encompassing both the frontend user interface and the backend API logic. The application allows users to explore healthy meal plans, customize their orders, manage subscriptions, submit testimonials, and provides an administrative dashboard for business insights.

This project is built with a modern and efficient stack, ensuring a smooth, responsive, and secure experience for all users.

---

## 🌐 Live Demo

You can view the live application here: [SEA Catering](https://cateringsea.vercel.app/)

---

## 🏛️ Architecture

This project follows a **monorepo architecture** where the frontend and backend logic reside in a single codebase. It leverages **Next.js API Routes** to integrate the backend functionality directly within the Next.js frontend application.

- **Frontend**: Built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui, deployed on Vercel.
- **Backend Logic**: Implemented using Next.js API Routes (Node.js/TypeScript), deployed alongside the frontend on Vercel. This layer interacts with the database via **Prisma ORM**.
- **Database**: PostgreSQL, hosted on Supabase.
- **Deployment**: The entire application (frontend + API) is deployed as a single unit on Vercel, connecting to the external Supabase database.

---

## 🛠️ Technologies Used

- 🧭 **Next.js 15 with App Router**: React framework for fast web apps, server-side rendering, and API routes.
- ⚛️ **React**: JavaScript library for building user interfaces.
- 📘 **TypeScript**: Typed JavaScript for better code quality and maintainability.
- 🎨 **Tailwind CSS**: Utility-first CSS for rapid, custom styling.
- 🧩 **shadcn/ui**: Accessible UI components built with Radix UI and Tailwind.
- 🛠️ **Prisma ORM**: Type-safe ORM for database interaction with PostgreSQL.
- 🐘 **PostgreSQL (via Supabase)**: Powerful relational database, managed and hosted by Supabase.
- 🔐 **bcryptjs**: Library for secure password hashing.
- 🎟️ **jsonwebtoken (JWT)**: Standard for secure, token-based user authentication.
- 🛡️ **csurf**: Middleware for CSRF protection in API Routes.
- 📊 **Recharts**: React charting library for data visualization.
- 🗓️ **date-fns**: Modern JavaScript library for date manipulation.
- 🐶 **Husky**: Git hooks manager for automating tasks like linting and formatting before commits.
- ✨ **Prettier**: Code formatter for consistent code style
- 🧹 **ESLint**: Pluggable linter for indentifying and reporting on patterns in JavaScript/TypScript code.
- 🧪 **Zod**: TypeScript-first schema declaration and validation library

---

## 🍽️ Key Features

- 🏠 **Homepage**: Engaging introduction with dynamic animations.
- 🧭 **Interactive Navigation**: Seamless user experience with responsive UI and role-based menu items.
- 🍱 **Meal Plans**: Browse and interact with various meal plans and modal previews.
- 💬 **Testimonials**: Submit new customer reviews and view a dynamic testimonial carousel (displaying 5 latest).
- 📦 **Subscription System**:

  - Customizable form with live price updates.
  - Secure submission to backend logic.
  - Users can view, pause, cancel, and resume their active subscriptions.

- 🔐 **User Authentication & Authorization**:

  - Register, login (email/password), and logout.
  - Password strength validation during registration.
  - Protected routes for authenticated users and specific roles.
  - Authentication managed via HTTP-only JWT cookies.

- 👤 **User Dashboard**: Personalized dashboard for managing subscriptions.
- 🧮 **Admin Dashboard**: Comprehensive dashboard displaying key business metrics (new subscriptions, MRR, reactivations, total active subscriptions) with date range filtering and interactive charts.

---

## 🖥️ System Requirements

Make sure you have the following installed on your machine:

- **Node.js** (LTS version 18.x or higher recommended)
- **pnpm** (recommended package manager)
- An active **Supabase PostgreSQL database** for your project.

---

## ⚙️ Installation & Local Setup Guide

Follow these steps to get the application up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/amaliartnaa/sea-catering.git
cd sea-catering
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables Configuration 🔐

Create a `.env` file in the project root (sea-catering/). This file will contain sensitive information and should NOT be pushed to public Git repositories.

```env
# Environment Variables for SEA Catering Application

DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
DIRECT_DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR-PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"
JWT_SECRET="YOUR_VERY_STRONG_RANDOM_SECRET_KEY_HERE"
```

> Replace `[YOUR_PROJECT_REF]`, `[YOUR_PASSWORD]`, and `YOUR_VERY_STRONG_RANDOM_SECRET_KEY_HERE` with your actual Supabase project details and secret key.

> How to generate your JWT_SECRET if you confused:  
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Database Setup & Migrations 🗄️

After configuring your `.env` file, run Prisma migrations:

```bash
npx prisma migrate dev --name initial_setup
npx prisma generate
```

### 5. Seed Initial Data (Optional) 🌱

```bash
pnpm run db:seed
```

### 6. Start the Application ▶️

```bash
pnpm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deployment to Vercel

1. Push your repository to GitHub
2. Connect your repository to Vercel
3. In the Vercel dashboard, add the following environment variables:

   - `DATABASE_URL`
   - `DIRECT_DATABASE_URL`
   - `JWT_SECRET`

4. Ensure these variables are available at both **Build** and **Runtime** scopes
5. Vercel will deploy automatically on push to `main` branch

---

## 🔗 API Endpoints Reference

### 🔐 Authentication

| Method | Endpoint             | Description                    | Auth | CSRF |
| ------ | -------------------- | ------------------------------ | ---- | ---- |
| POST   | `/api/auth/register` | Register a new user            | No   | No   |
| POST   | `/api/auth/login`    | Log in and receive auth cookie | No   | No   |
| GET    | `/api/auth/me`       | Get logged-in user info        | Yes  | No   |
| POST   | `/api/auth/logout`   | Log out and clear session      | Yes  | No   |

### 🛡️ CSRF Token

| Method | Endpoint          | Description    | Auth | CSRF |
| ------ | ----------------- | -------------- | ---- | ---- |
| GET    | `/api/csrf-token` | Get CSRF token | No   | No   |

### 📦 Subscriptions

| Method | Endpoint                        | Description               | Auth | CSRF |
| ------ | ------------------------------- | ------------------------- | ---- | ---- |
| POST   | `/api/subscriptions`            | Create a subscription     | Yes  | Yes  |
| GET    | `/api/subscriptions/me`         | View user's subscriptions | Yes  | No   |
| PUT    | `/api/subscriptions/:id/pause`  | Pause a subscription      | Yes  | Yes  |
| PUT    | `/api/subscriptions/:id/cancel` | Cancel a subscription     | Yes  | Yes  |
| PUT    | `/api/subscriptions/:id/resume` | Resume a subscription     | Yes  | Yes  |

### 💬 Testimonials

| Method | Endpoint            | Description           | Auth | CSRF |
| ------ | ------------------- | --------------------- | ---- | ---- |
| POST   | `/api/testimonials` | Submit a testimonial  | No   | Yes  |
| GET    | `/api/testimonials` | View all testimonials | No   | No   |

### 📊 Admin Metrics

| Method | Endpoint                               | Description          | Auth | CSRF |
| ------ | -------------------------------------- | -------------------- | ---- | ---- |
| GET    | `/api/admin/metrics?startDate&endDate` | Get business metrics | Yes  | No   |

---

## 🧑‍💻 Guide for Testing Admin Access

1. Stop your application server:

```bash
Ctrl + C
```

2. Open Prisma Studio:

```bash
pnpm prisma studio
```

3. In the **User** table, find the account to promote and set the `role` field to `admin`
4. Save changes
5. Restart your server:

```bash
pnpm run dev
```

6. Log out and log in again → access `/admin/dashboard`

---
