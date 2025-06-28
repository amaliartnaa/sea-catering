# SEA Catering Application 🥗

Welcome to the **SEA Catering** project! This repository contains the complete **full-stack application**, encompassing both the frontend user interface and the backend API logic. The application allows users to explore healthy meal plans, customize their orders, manage subscriptions, submit testimonials, and provides an administrative dashboard for business insights.

This project is built with a modern and efficient stack, ensuring a smooth, responsive, and secure experience for all users.

---

## 🌐 Live Demo

You can view the live application here: [SEA Catering](https://sea-catering-mu.vercel.app/)

---

## 🏛️ Architecture

This project follows a **monorepo architecture** where the frontend and backend logic reside in a single codebase. It leverages **Next.js API Routes** to integrate the backend functionality directly within the Next.js frontend application.

- **Frontend**: Built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui, deployed on Vercel.
- **Backend Logic**: Implemented using Next.js API Routes (Node.js/TypeScript), deployed alongside the frontend on Vercel. This layer interacts with the database via **Prisma ORM**.
- **Database**: PostgreSQL, hosted on Supabase.
- **Deployment**: The entire application (frontend + API) is deployed as a single unit on Vercel, connecting to the external Supabase database.

---

## 🛠️ Technologies Used

- **Next.js**: A React framework for building web applications, providing server-side rendering, API routes, and static site generation capabilities.
- **React**: A JavaScript library for building user interfaces, enabling component-based UI development.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability through static type checking.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your HTML.
- **shadcn/ui**: A collection of beautiful and accessible UI components built with Radix UI and Tailwind CSS, offering ready-to-use UI primitives.
- **Prisma ORM**: An open-source ORM (Object-Relational Mapper) that makes database access easy with type-safe queries, used to interact with PostgreSQL.
- **PostgreSQL (via Supabase)**: A powerful, open-source relational database system. Supabase provides a managed PostgreSQL instance, simplifying database hosting and management.
- **bcryptjs**: A library used for hashing passwords, ensuring user authentication is secure by storing encrypted passwords.
- **jsonwebtoken (JWT)**: A standard for creating access tokens that assert claims (like user identity) in a secure way, used for user authentication sessions.
- **csurf**: A middleware for Express.js (used in Next.js API Routes) that provides protection against Cross-Site Request Forgery (CSRF) attacks, enhancing application security.
- **Recharts**: A composable charting library built with React and D3, used for rendering interactive data visualizations in the admin dashboard.
- **date-fns**: A modern JavaScript date utility library that provides a comprehensive, yet simple and consistent toolset for manipulating dates.

---

## 🍽️ Key Features

- **Homepage**: Engaging introduction with dynamic animations.
- **Interactive Navigation**: Seamless user experience with responsive UI and role-based menu items.
- **Meal Plans**: Browse and interact with various meal plans and modal previews.
- **Testimonials**: Submit new customer reviews and view a dynamic testimonial carousel (displaying 5 latest).
- **Subscription System**:

  - Customizable form with live price updates.
  - Secure submission to backend logic.
  - Users can view, pause, cancel, and resume their active subscriptions.

- **User Authentication & Authorization**:

  - Register, login (email/password), and logout.
  - Password strength validation during registration.
  - Protected routes for authenticated users and specific roles.
  - Authentication managed via HTTP-only JWT cookies.

- **User Dashboard**: Personalized dashboard for managing subscriptions.
- **Admin Dashboard**: Comprehensive dashboard displaying key business metrics (new subscriptions, MRR, reactivations, total active subscriptions) with date range filtering and interactive charts.

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
