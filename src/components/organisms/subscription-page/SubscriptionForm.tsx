"use client";

import React, { useState, useEffect } from "react";
import { MEAL_PLANS } from "@/src/lib/constants";
import { Label } from "@/src/components/atoms/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/ui/select";
import { Button } from "@/src/components/atoms/ui/button";
import { cn } from "@/src/lib/utils";
import { FormField } from "@/src/components/molecules/common/FormField";
import { CheckboxGroup } from "@/src/components/molecules/common/CheckboxGroup";

type MealType = "Breakfast" | "Lunch" | "Dinner";
type DeliveryDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface SubscriptionFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
  isAuthenticated: boolean;
  onOpenConfirmDialog: (data: any, calculatedPrice: number) => void;
}

export function SubscriptionForm({
  onSubmit,
  loading,
  isAuthenticated,
  onOpenConfirmDialog,
}: SubscriptionFormProps) {
  const [customerName, setCustomerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [selectedDeliveryDays, setSelectedDeliveryDays] = useState<
    DeliveryDay[]
  >([]);
  const [allergies, setAllergies] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allMealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner"];
  const allDeliveryDays: DeliveryDay[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const selectedPlan = MEAL_PLANS.find((plan) => plan.id === selectedPlanId);
    if (
      selectedPlan &&
      selectedMealTypes.length > 0 &&
      selectedDeliveryDays.length > 0
    ) {
      const calculatedPrice =
        selectedPlan.price *
        selectedMealTypes.length *
        selectedDeliveryDays.length *
        4.3;
      setTotalPrice(calculatedPrice);
    } else {
      setTotalPrice(0);
    }
  }, [selectedPlanId, selectedMealTypes, selectedDeliveryDays]);

  useEffect(() => {
    const isValid =
      customerName.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      selectedPlanId !== "" &&
      selectedMealTypes.length > 0 &&
      selectedDeliveryDays.length > 0;
    setIsFormValid(isValid);
  }, [
    customerName,
    phoneNumber,
    selectedPlanId,
    selectedMealTypes,
    selectedDeliveryDays,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });

    if (id === "customerName") {
      setCustomerName(value);
    } else if (id === "phoneNumber") {
      setPhoneNumber(value);
    } else if (id === "allergies") {
      setAllergies(value);
    }
  };

  const handleMealTypeChange = (mealType: MealType, checked: boolean) => {
    setSelectedMealTypes((prev) =>
      checked ? [...prev, mealType] : prev.filter((m) => m !== mealType),
    );
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.mealTypes;
      return rest;
    });
  };

  const handleDeliveryDayChange = (day: DeliveryDay, checked: boolean) => {
    setSelectedDeliveryDays((prev) =>
      checked ? [...prev, day] : prev.filter((d) => d !== day),
    );
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.deliveryDays;
      return rest;
    });
  };

  const handlePlanSelectChange = (value: string) => {
    setSelectedPlanId(value);
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.planId;
      return rest;
    });
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let newErrors: Record<string, string> = {};
    if (customerName.trim() === "")
      newErrors.customerName = "Nama lengkap wajib diisi.";
    if (phoneNumber.trim() === "")
      newErrors.phoneNumber = "Nomor telepon wajib diisi.";
    if (selectedPlanId === "")
      newErrors.planId = "Paket makanan wajib dipilih.";
    if (selectedMealTypes.length === 0)
      newErrors.mealTypes = "Setidaknya satu jenis makanan harus dipilih.";
    if (selectedDeliveryDays.length === 0)
      newErrors.deliveryDays = "Setidaknya satu hari pengiriman harus dipilih.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = {
      customerName,
      phoneNumber,
      planId: selectedPlanId,
      mealTypes: selectedMealTypes,
      deliveryDays: selectedDeliveryDays,
      allergies: allergies.trim() === "" ? null : allergies,
    };
    onOpenConfirmDialog(formData, totalPrice);
  };

  return (
    <form
      onSubmit={handlePreSubmit}
      className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto space-y-8"
    >
      <FormField
        id="customerName"
        label="Nama Lengkap"
        value={customerName}
        onChange={handleChange}
        error={errors.customerName}
        required
      />

      <FormField
        id="phoneNumber"
        label="Nomor Telepon Aktif"
        type="tel"
        value={phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
        placeholder="Contoh: 081234567890"
        required
      />

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="planSelection">
          Pilih Paket <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedPlanId}
          onValueChange={handlePlanSelectChange}
          required
        >
          <SelectTrigger
            id="planSelection"
            aria-invalid={errors.planId ? "true" : "false"}
          >
            <SelectValue placeholder="-- Pilih Paket Makanan --" />
          </SelectTrigger>
          <SelectContent>
            {MEAL_PLANS.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} - Rp{plan.price.toLocaleString("id-ID")} per meal
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.planId && (
          <p className="text-red-500 text-sm mt-1">{errors.planId}</p>
        )}
      </div>

      <CheckboxGroup
        label="Jenis Makanan"
        options={allMealTypes}
        selectedOptions={selectedMealTypes}
        onCheckedChange={handleMealTypeChange}
        errorMessage={
          errors.mealTypes ||
          (selectedMealTypes.length === 0
            ? "Setidaknya satu jenis makanan harus dipilih."
            : undefined)
        }
        required
      />

      <CheckboxGroup
        label="Hari Pengiriman"
        options={allDeliveryDays}
        selectedOptions={selectedDeliveryDays}
        onCheckedChange={handleDeliveryDayChange}
        errorMessage={
          errors.deliveryDays ||
          (selectedDeliveryDays.length === 0
            ? "Setidaknya satu hari pengiriman harus dipilih."
            : undefined)
        }
        required
        columns={2}
      />

      <FormField
        id="allergies"
        label="Alergi / Pembatasan Diet Lainnya (Opsional)"
        value={allergies}
        onChange={handleChange}
        error={errors.allergies}
        as="textarea"
        placeholder="Contoh: Alergi kacang, tidak suka pedas, gluten-free..."
      />

      <div className="bg-emerald-50 p-6 rounded-lg text-center border border-emerald-200">
        <h3 className="text-2xl font-bold text-emerald-800 mb-2">
          Total Harga Langganan:
        </h3>
        <p className="text-4xl font-extrabold text-emerald-900">
          Rp{totalPrice.toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          (Dihitung berdasarkan pilihan Anda dan sudah termasuk biaya bulanan)
        </p>
      </div>

      <div className="text-center pt-4">
        <Button
          type="submit"
          className={cn(
            "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-md lg:text-lg py-3 px-10 rounded-full cursor-pointer",
            (!isFormValid || loading) && "opacity-60 cursor-not-allowed",
          )}
          disabled={!isFormValid || loading}
        >
          {loading ? "Memproses..." : "Berlangganan Sekarang"}
        </Button>
      </div>
    </form>
  );
}
