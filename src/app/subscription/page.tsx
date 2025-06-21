"use client";

import React, { useState, useEffect } from "react";
import { MEAL_PLANS } from "@/src/lib/constants";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { cn } from "@/src/lib/utils";

type MealType = "Breakfast" | "Lunch" | "Dinner";
type DeliveryDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export default function SubscriptionPage() {
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

  const handleMealTypeChange = (mealType: MealType, checked: boolean) => {
    if (checked) {
      setSelectedMealTypes((prev) => [...prev, mealType]);
    } else {
      setSelectedMealTypes((prev) => prev.filter((m) => m !== mealType));
    }
  };

  const handleDeliveryDayChange = (day: DeliveryDay, checked: boolean) => {
    if (checked) {
      setSelectedDeliveryDays((prev) => [...prev, day]);
    } else {
      setSelectedDeliveryDays((prev) => prev.filter((d) => d !== day));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Harap lengkapi semua kolom yang wajib diisi (*).");
      return;
    }

    const formData = {
      customerName,
      phoneNumber,
      planId: selectedPlanId,
      mealTypes: selectedMealTypes,
      deliveryDays: selectedDeliveryDays,
      allergies: allergies.trim() === "" ? null : allergies,
      totalPrice,
    };

    console.log("Data Langganan yang akan dikirim:", formData);
    alert(
      "Formulir langganan berhasil disubmit! (Data masih tercetak di konsol. Integrasi backend akan dilakukan di langkah selanjutnya.)",
    );

    setCustomerName("");
    setPhoneNumber("");
    setSelectedPlanId("");
    setSelectedMealTypes([]);
    setSelectedDeliveryDays([]);
    setAllergies("");
  };

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Berlangganan Paket Makanan Sehat
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto space-y-8"
      >
        {/* Nama Lengkap */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="customerName">
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="customerName"
            placeholder="Masukkan nama lengkap Anda"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phoneNumber">
            Nomor Telepon Aktif <span className="text-red-500">*</span>
          </Label>
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="Contoh: 081234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            pattern="[0-9]{10,13}"
            title="Nomor telepon harus berupa angka, antara 10 sampai 13 digit."
            required
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="planSelection">
            Pilih Paket <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedPlanId}
            onValueChange={setSelectedPlanId}
            required
          >
            <SelectTrigger id="planSelection">
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
        </div>

        <div className="grid w-full gap-2">
          <Label>
            Jenis Makanan <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {allMealTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`meal-type-${type}`}
                  checked={selectedMealTypes.includes(type)}
                  onCheckedChange={(checked) =>
                    handleMealTypeChange(type, Boolean(checked))
                  }
                />
                <Label htmlFor={`meal-type-${type}`} className="cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
          {selectedMealTypes.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Setidaknya satu jenis makanan harus dipilih.
            </p>
          )}
        </div>

        <div className="grid w-full gap-2">
          <Label>
            Hari Pengiriman <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
            {allDeliveryDays.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`delivery-day-${day}`}
                  checked={selectedDeliveryDays.includes(day)}
                  onCheckedChange={(checked) =>
                    handleDeliveryDayChange(day, Boolean(checked))
                  }
                />
                <Label
                  htmlFor={`delivery-day-${day}`}
                  className="cursor-pointer"
                >
                  {day}
                </Label>
              </div>
            ))}
          </div>
          {selectedDeliveryDays.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Setidaknya satu hari pengiriman harus dipilih.
            </p>
          )}
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="allergies">
            Alergi / Pembatasan Diet Lainnya (Opsional)
          </Label>
          <Textarea
            id="allergies"
            placeholder="Contoh: Alergi kacang, tidak suka pedas, gluten-free..."
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
          />
        </div>

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
              "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-lg py-3 px-10 rounded-full",
              !isFormValid && "opacity-60 cursor-not-allowed",
            )}
            disabled={!isFormValid}
          >
            Berlangganan Sekarang
          </Button>
        </div>
      </form>
    </div>
  );
}
