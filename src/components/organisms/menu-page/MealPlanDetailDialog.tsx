import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/atoms/ui/dialog";
import { Button } from "@/src/components/atoms/ui/button";
import { MealPlan } from "@/src/types";

interface MealPlanDetailDialogProps {
  plan: MealPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MealPlanDetailDialog({
  plan,
  isOpen,
  onClose,
}: MealPlanDetailDialogProps) {
  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-xl p-6 bg-white rounded-lg shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-emerald-800 mb-2">
            {plan.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Rp{plan.price.toLocaleString("id-ID")} per meal
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          {plan.image && (
            <div className="relative w-full h-56 mb-4 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={plan.image}
                alt={plan.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          <p className="text-gray-700 leading-relaxed text-base">
            {plan.details}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
