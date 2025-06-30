import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/atoms/ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Testimonial } from "@/src/types/index";
import { SAMPLE_TESTIMONIALS } from "@/src/lib/constants";
import { TestimonialCard } from "@/src/components/molecules/content/TestimonialCard";
import Link from "next/link";

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

export function TestimonialSlider() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [displayedTestimonials, setDisplayedTestimonials] = useState<
    Testimonial[]
  >([]);
  const [direction, setDirection] = useState(0);

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

  const handleNextTestimonial = () => {
    setDirection(1);
    nextTestimonial();
  };

  const handlePrevTestimonial = () => {
    setDirection(-1);
    prevTestimonial();
  };

  return (
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
                <TestimonialCard testimonial={currentTestimonial} />
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
              {currentTestimonialIndex + 1} dari {displayedTestimonials.length}
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
  );
}
