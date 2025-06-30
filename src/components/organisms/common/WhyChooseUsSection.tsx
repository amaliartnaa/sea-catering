import React from "react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/src/components/molecules/content/FeatureCard";
import { FiEdit } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";

export function WhyChooseUsSection() {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-center text-emerald-700 mb-12"
      >
        Mengapa Memilih Kami?
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <FeatureCard
          icon={FiEdit}
          title="Kustomisasi Menu Tanpa Batas"
          description="Pilih bahan, porsi, dan preferensi diet Anda. Sesuaikan hidangan Anda agar benar-benar sesuai dengan gaya hidup dan selera unik Anda."
        />
        <FeatureCard
          icon={IoLocationOutline}
          title="Pengiriman Nasional Cepat"
          description="Kami bangga melayani pengiriman ke berbagai kota besar di seluruh Indonesia. Makanan sehat Anda tiba tepat waktu, di mana pun Anda berada."
          delay={0.2}
        />
        <FeatureCard
          icon={HiOutlineDocumentText}
          title="Informasi Gizi Transparan"
          description="Setiap hidangan dilengkapi dengan detail informasi gizi. Buat pilihan yang cerdas dan pantau asupan Anda dengan mudah."
          delay={0.4}
        />
      </div>
    </section>
  );
}
