import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/src/components/atoms/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function HeroSection() {
  return (
    <>
      <header className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-6 shadow-lg">
        <div className="container mx-auto flex flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight mb-3"
          >
            SEA Catering
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl italic font-light"
          >
            &quot;Healthy Meals, Anytime, Anywhere&quot;
          </motion.p>
        </div>
      </header>

      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="/images/hero-catering.jpg"
          alt="Healthy meals delivered"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="brightness-75"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="absolute inset-0 bg-black/60 flex items-center justify-center text-center p-4"
        >
          <div className="text-white">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Solusi Makanan Sehat untuk Gaya Hidup Modern Anda
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
            >
              SEA Catering menyediakan pilihan hidangan bergizi yang dapat
              disesuaikan, dikirim langsung ke seluruh penjuru Indonesia. Mulai
              hidup sehat Anda bersama kami!
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/subscription">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg lg:text-xl py-6 rounded-full shadow-lg cursor-pointer"
                >
                  Mulai Berlangganan Sekarang!
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
