import { z } from "zod";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"] as const;
const DELIVERY_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const registerSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi."),
  email: z
    .string()
    .email("Format email tidak valid.")
    .min(1, "Email wajib diisi."),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .regex(/[A-Z]/, "Password harus mengandung huruf kapital.")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil.")
    .regex(/[0-9]/, "Password harus mengandung angka.")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung karakter khusus."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid.")
    .min(1, "Email wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

export const subscriptionSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan wajib diisi."),
  phoneNumber: z
    .string()
    .regex(
      /^08[0-9]{8,11}$/,
      "Nomor telepon tidak valid (contoh: 08123456789).",
    ),
  planId: z.string().min(1, "ID paket wajib diisi."),
  mealTypes: z
    .array(z.string())
    .min(1, "Setidaknya satu jenis makanan harus dipilih.")
    .refine(
      (items) =>
        items.every((item) =>
          MEAL_TYPES.includes(item as (typeof MEAL_TYPES)[number]),
        ),
      {
        message: "Jenis makanan tidak valid.",
        path: ["mealTypes"],
      },
    ),

  deliveryDays: z
    .array(z.string())
    .min(1, "Setidaknya satu hari pengiriman harus dipilih.")
    .refine(
      (items) =>
        items.every((item) =>
          DELIVERY_DAYS.includes(item as (typeof DELIVERY_DAYS)[number]),
        ),
      {
        message: "Hari pengiriman tidak valid.",
        path: ["deliveryDays"],
      },
    ),
  allergies: z.string().optional().nullable(),
});

export const testimonialSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan wajib diisi."),
  reviewMessage: z
    .string()
    .min(1, "Pesan ulasan wajib diisi.")
    .max(500, "Pesan ulasan terlalu panjang."),
  rating: z
    .number()
    .int()
    .min(1, "Rating minimal 1.")
    .max(5, "Rating maksimal 5."),
});
