"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { cn } from "@/src/lib/utils";

interface RatingStarsProps {
  rating: number;
  setRating?: (r: number) => void;
  editable?: boolean;
  size?: "sm" | "md" | "lg";
}

export const RatingStars = ({
  rating,
  setRating,
  editable = false,
  size = "md",
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentFillLevel = editable && hoverRating > 0 ? hoverRating : rating;

  const starSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex justify-center mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={cn(
            starSizeClasses[size],
            star <= currentFillLevel ? "text-yellow-400" : "text-gray-300",
            editable ? "cursor-pointer hover:text-yellow-500" : "",
          )}
          fill="currentColor"
          onMouseEnter={editable ? () => setHoverRating(star) : undefined}
          onMouseLeave={editable ? () => setHoverRating(0) : undefined}
          onClick={editable ? () => setRating?.(star) : undefined}
        />
      ))}
    </div>
  );
};
