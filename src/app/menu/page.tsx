"use client";

import React, { useState } from "react";
import { MEAL_PLANS } from "@/src/lib/constants";
import { MealPlan } from "@/src/types";

import { MealPlanCard } from "@/src/components/molecules/content/MealPlanCard";
import { MealPlanDetailDialog } from "@/src/components/organisms/menu-page/MealPlanDetailDialog";

export default function MenuPage() {
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (plan: MealPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Pilihan Paket Makanan Sehat
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {MEAL_PLANS.map((plan) => (
          <MealPlanCard key={plan.id} plan={plan} onViewDetails={openModal} />
        ))}
      </div>

      <MealPlanDetailDialog
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
