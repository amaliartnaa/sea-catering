"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { FiEdit } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";

import { motion } from "framer-motion";

export default function HomePage() {
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

  const featureCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen flex flex-col">
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
              <Link href="/login">
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

      <main className="container mx-auto p-8 py-16 flex-grow">
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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={featureCardVariants}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 text-center"
            >
              <div className="text-emerald-500 mb-4">
                <FiEdit className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                Kustomisasi Menu Tanpa Batas
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Pilih bahan, porsi, dan preferensi diet Anda. Sesuaikan hidangan
                Anda agar benar-benar sesuai dengan gaya hidup dan selera unik
                Anda.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={featureCardVariants}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 text-center"
            >
              <div className="text-emerald-500 mb-4">
                <IoLocationOutline className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                Pengiriman Nasional Cepat
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Kami bangga melayani pengiriman ke berbagai kota besar di
                seluruh Indonesia. Makanan sehat Anda tiba tepat waktu, di mana
                pun Anda berada.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={featureCardVariants}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 text-center"
            >
              <div className="text-emerald-500 mb-4">
                <HiOutlineDocumentText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                Informasi Gizi Transparan
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Setiap hidangan dilengkapi dengan detail informasi gizi. Buat
                pilihan yang cerdas dan pantau asupan Anda dengan mudah.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
