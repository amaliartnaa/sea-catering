"use client";

import React from "react";
import { HeroSection } from "@/src/components/organisms/common/HeroSection";
import { WhyChooseUsSection } from "@/src/components/organisms/common/WhyChooseUsSection";
import { TestimonialSlider } from "@/src/components/organisms/common/TestimonialSlider";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <main className="container mx-auto p-8 py-16 flex-grow">
        <WhyChooseUsSection />
        <TestimonialSlider />
      </main>
    </div>
  );
}
