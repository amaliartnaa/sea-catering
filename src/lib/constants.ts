import { MealPlan, Testimonial } from "@/src/types";

export const MEAL_PLANS: MealPlan[] = [
  {
    id: "plan-diet",
    name: "Diet Plan",
    price: 30000,
    description:
      "Fokus pada makanan rendah kalori, tinggi serat untuk penurunan berat badan yang efektif.",
    details:
      "Paket ini mencakup hidangan dengan porsi terkontrol, kaya sayuran segar, dan protein tanpa lemak, dirancang khusus untuk mendukung tujuan diet dan penurunan berat badan Anda. Ideal untuk mereka yang ingin mengelola asupan kalori tanpa mengorbankan rasa dan nutrisi.",
    image: "/images/diet-plan.jpg",
  },
  {
    id: "plan-protein",
    name: "Protein Plan",
    price: 40000,
    description:
      "Tinggi protein untuk membangun dan memelihara massa otot, sempurna untuk gaya hidup aktif.",
    details:
      "Dirancang khusus untuk atlet, binaragawan, dan individu yang aktif secara fisik. Paket protein tinggi ini menyediakan sumber protein yang melimpah dari daging tanpa lemak berkualitas tinggi, ikan, telur, dan legum. Mendukung pemulihan otot yang cepat dan pertumbuhan massa otot.",
    image: "/images/protein-plan.jpg",
  },
  {
    id: "plan-royal",
    name: "Royal Plan",
    price: 60000,
    description:
      "Pilihan premium dengan bahan-bahan berkualitas tinggi, hidangan eksotis, dan cita rasa mewah.",
    details:
      "Nikmati pengalaman kuliner mewah dan eksklusif dengan paket Royal kami. Menampilkan bahan-bahan pilihan dari seluruh dunia, hidangan gourmet yang disiapkan oleh koki ahli, dan kombinasi rasa yang unik serta tak terlupakan. Cocok untuk Anda yang mencari kualitas, kelezatan, dan pengalaman bersantap terbaik.",
    image: "/images/royal-plan.jpg",
  },
  {
    id: "plan-vegetarian",
    name: "Vegetarian Plan",
    price: 35000,
    description:
      "Pilihan hidangan nabati yang lezat dan bergizi, kaya akan serat dan vitamin.",
    details:
      "Paket Vegetarian kami menawarkan berbagai hidangan lezat dan bergizi sepenuhnya berbasis nabati. Dengan fokus pada sayuran segar, biji-bijian utuh, kacang-kacangan, dan buah-buahan, paket ini memastikan Anda mendapatkan semua nutrisi penting tanpa produk hewani. Sempurna untuk vegetarian atau mereka yang ingin mengurangi konsumsi daging.",
    image: "/images/vegetarian-plan.jpg",
  },
  {
    id: "plan-kids",
    name: "Kids Healthy Plan",
    price: 25000,
    description:
      "Makanan sehat dan menyenangkan khusus untuk anak-anak, dengan nutrisi seimbang.",
    details:
      "Dirancang khusus untuk kebutuhan gizi anak-anak yang sedang tumbuh. Paket Kids Healthy Plan kami menyajikan hidangan yang lezat, menarik, dan penuh nutrisi penting untuk mendukung perkembangan fisik dan mental mereka. Kami memastikan setiap porsi seimbang dan dibuat dengan bahan-bahan segar, bebas pengawet.",
    image: "/images/kids-plan.jpg",
  },
];

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    customerName: "Sarah W.",
    reviewMessage:
      "SEA Catering benar-benar mengubah cara saya makan. Makanan sehatnya lezat dan pengirimannya selalu tepat waktu!",
    rating: 5,
  },
  {
    id: "t2",
    customerName: "Budi S.",
    reviewMessage:
      "Sangat suka dengan kustomisasi menu. Saya bisa memilih makanan sesuai kebutuhan diet saya. Luar biasa!",
    rating: 4,
  },
  {
    id: "t3",
    customerName: "Citra A.",
    reviewMessage:
      "Pengalaman berlangganan yang mudah dan makanan yang konsisten. Rekomendasi banget!",
    rating: 5,
  },
  {
    id: "t4",
    customerName: "Dewi K.",
    reviewMessage:
      "Pilihan vegetarian mereka sangat enak dan bervariasi. Sangat membantu gaya hidup saya!",
    rating: 5,
  },
  {
    id: "t5",
    customerName: "Fandi A.",
    reviewMessage:
      "Membantu saya tetap fit dan produktif. Makanannya selalu segar dan berkualitas.",
    rating: 4,
  },
];
