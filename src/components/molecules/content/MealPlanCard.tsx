import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/ui/card";
import { Button } from "@/src/components/atoms/ui/button";
import { MealPlan } from "@/src/types";

interface MealPlanCardProps {
  plan: MealPlan;
  onViewDetails: (plan: MealPlan) => void;
}

export function MealPlanCard({ plan, onViewDetails }: MealPlanCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {plan.image && (
        <div className="relative h-48 px-6">
          <div className="w-full h-full rounded-lg overflow-hidden relative">
            <Image
              src={plan.image}
              alt={plan.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              style={{ objectFit: "cover" }}
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}
      <CardHeader className="flex-grow">
        <CardTitle className="text-2xl font-bold text-emerald-700 mb-2">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          {plan.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xl font-semibold text-gray-800">
          Rp{plan.price.toLocaleString("id-ID")}{" "}
          <span className="text-sm font-normal text-gray-500">per meal</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          onClick={() => onViewDetails(plan)}
        >
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
}
