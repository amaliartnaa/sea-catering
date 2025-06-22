"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MEAL_PLANS } from "@/src/lib/constants";
import { MealPlan } from "@/src/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";

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
          <Card
            key={plan.id}
            className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {plan.image && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                  sizes=""
                />
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
                <span className="text-sm font-normal text-gray-500">
                  per meal
                </span>
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => openModal(plan)}
              >
                Lihat Detail
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedPlan && (
          <DialogContent className="sm:max-w-[425px] md:max-w-xl p-6 bg-white rounded-lg shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-emerald-800 mb-2">
                {selectedPlan.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-lg">
                Rp{selectedPlan.price.toLocaleString("id-ID")} per meal
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              {selectedPlan.image && (
                <div className="relative w-full h-56 mb-4 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={selectedPlan.image}
                    alt={selectedPlan.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <p className="text-gray-700 leading-relaxed text-base">
                {selectedPlan.details}
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeModal}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
