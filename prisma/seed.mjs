import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  try {
    await prisma.subscription.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.mealPlan.deleteMany();
  } catch {
    console.warn(
      "Could not clear some tables, might not exist yet (first seed).",
    );
  }

  const mealPlans = [
    {
      id: "plan-diet",
      name: "Diet Plan",
      price: 30000,
      description:
        "Fokus pada makanan rendah kalori, tinggi serat untuk penurunan berat badan yang efektif.",
      details:
        "Paket ini mencakup hidangan dengan porsi terkontrol, kaya sayuran segar dan protein tanpa lemak, dirancang untuk mendukung tujuan diet Anda. Ideal untuk mereka yang ingin mengelola berat badan tanpa mengorbankan rasa.",
      image: "/images/diet-plan.jpg",
    },
    {
      id: "plan-protein",
      name: "Protein Plan",
      price: 40000,
      description:
        "Tinggi protein untuk membangun dan memelihara massa otot, sempurna untuk gaya hidup aktif.",
      details:
        "Dirancang untuk atlet dan individu yang aktif, paket protein tinggi ini menyediakan sumber protein yang melimpah dari daging tanpa lemak, ikan, telur, dan legum. Mendukung pemulihan otot dan pertumbuhan.",
      image: "/images/protein-plan.jpg",
    },
    {
      id: "plan-royal",
      name: "Royal Plan",
      price: 60000,
      description:
        "Pilihan premium dengan bahan-bahan berkualitas tinggi dan hidangan eksotis.",
      details:
        "Nikmati pengalaman kuliner mewah dengan paket Royal kami. Menampilkan bahan-bahan pilihan, hidangan gourmet, dan kombinasi rasa yang unik. Cocok untuk Anda yang mencari kualitas dan kelezatan terbaik.",
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

  for (const plan of mealPlans) {
    await prisma.mealPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
