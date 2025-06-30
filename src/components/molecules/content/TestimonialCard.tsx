import React from "react";
import { Card, CardContent } from "@/src/components/atoms/ui/card";
import { Testimonial } from "@/src/types/index";
import { RatingStars } from "@/src/components/atoms/RatingStars";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm sm:p-8 rounded-xl shadow-xl border border-emerald-100 text-center">
      <CardContent className="flex flex-col items-center">
        <p className="text-base sm:text-xl md:text-2xl italic text-gray-800 mb-4 sm:mb-6 leading-relaxed font-medium">
          &quot;{testimonial.reviewMessage}&quot;
        </p>
        <p className="font-bold text-lg sm:text-xl text-emerald-900 mb-2">
          - {testimonial.customerName}
        </p>
        <RatingStars rating={testimonial.rating || 0} />
      </CardContent>
    </Card>
  );
}
