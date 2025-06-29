"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { FiEdit } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { Testimonial } from "@/src/types/index";
import { SAMPLE_TESTIMONIALS } from "@/src/lib/constants";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex justify-center mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={cn(
            "w-6 h-6",
            star <= rating ? "text-yellow-400" : "text-gray-300",
          )}
          fill="currentColor"
        />
      ))}
    </div>
  );
};

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

const sectionScrollInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const testimonialSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.5, ease: "easeIn" as const },
  }),
};

export default function HomePage() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [displayedTestimonials, setDisplayedTestimonials] = useState<
    Testimonial[]
  >([]);

  useEffect(() => {
    if (SAMPLE_TESTIMONIALS.length > 0) {
      setDisplayedTestimonials(SAMPLE_TESTIMONIALS);
    } else {
      setDisplayedTestimonials([]);
    }
  }, []);

  const nextTestimonial = () => {
    if (displayedTestimonials.length === 0) return;
    setCurrentTestimonialIndex(
      (prevIndex) => (prevIndex + 1) % displayedTestimonials.length,
    );
  };

  const prevTestimonial = () => {
    if (displayedTestimonials.length === 0) return;
    setCurrentTestimonialIndex(
      (prevIndex) =>
        (prevIndex - 1 + displayedTestimonials.length) %
        displayedTestimonials.length,
    );
  };

  const currentTestimonial = displayedTestimonials[currentTestimonialIndex];

  const [direction, setDirection] = useState(0);

  const handleNextTestimonial = () => {
    setDirection(1);
    nextTestimonial();
  };

  const handlePrevTestimonial = () => {
    setDirection(-1);
    prevTestimonial();
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

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionScrollInVariants}
          className="relative mb-16 bg-gradient-to-br from-emerald-100 to-green-100 p-8 sm:p-10 rounded-xl shadow-2xl border border-emerald-300 overflow-hidden"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-emerald-800 mb-10 sm:mb-12 leading-tight">
            Apa Kata Mereka Tentang SEA Catering?
          </h2>
          {displayedTestimonials.length === 0 ? (
            <p className="text-center text-base sm:text-lg text-gray-700 py-4">
              Belum ada testimoni. Kami menantikan pengalaman Anda!
            </p>
          ) : (
            <div className="relative max-w-xl sm:max-w-2xl mx-auto">
              <div className="relative w-full min-h-[300px] sm:min-h-[240px] flex items-center justify-center mb-8 sm:mb-8">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentTestimonialIndex}
                    custom={direction}
                    variants={testimonialSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full px-2 sm:px-0"
                  >
                    <Card className="bg-white/90 backdrop-blur-sm sm:p-8 rounded-xl shadow-xl border border-emerald-100 text-center">
                      <CardContent className="flex flex-col items-center">
                        <p className="text-base sm:text-xl md:text-2xl italic text-gray-800 mb-4 sm:mb-6 leading-relaxed font-medium">
                          &quot;{currentTestimonial?.reviewMessage}&quot;
                        </p>
                        <p className="font-bold text-lg sm:text-xl text-emerald-900 mb-2">
                          - {currentTestimonial?.customerName}
                        </p>
                        <RatingStars rating={currentTestimonial?.rating || 0} />
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center mt-4 sm:mt-8 relative z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevTestimonial}
                  className="rounded-full w-10 h-10 sm:w-14 sm:h-14 bg-white/80 text-emerald-700 border-emerald-500 hover:bg-emerald-200 hover:border-emerald-700 transition-all duration-300 shadow-md cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <FaArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                <p className="text-sm sm:text-lg md:text-xl text-gray-700 font-semibold">
                  {currentTestimonialIndex + 1} dari{" "}
                  {displayedTestimonials.length}
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextTestimonial}
                  className="rounded-full w-10 h-10 sm:w-14 sm:h-14 bg-white/80 text-emerald-700 border-emerald-500 hover:bg-emerald-200 hover:border-emerald-700 transition-all duration-300 shadow-md cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <FaArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mt-10 sm:mt-12">
            <Link href="/contact">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-base sm:text-lg py-2.5 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg transition-colors duration-300 cursor-pointer">
                Bagikan Pengalaman Anda!
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
