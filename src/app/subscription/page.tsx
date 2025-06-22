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
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect_from=/subscription");
    }
  }, [isAuthenticated, isLoading, router]);

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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-center text-lg text-gray-700">
        <p>Memuat atau mengarahkan ke halaman login...</p>
      </div>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setIsSuccess(false);

    if (!isFormValid) {
      setMessage("Harap lengkapi semua kolom yang wajib diisi (*).");
      return;
    }

    setLoading(true);

    let csrfToken;
    try {
      const csrfResponse = await fetch("/api/csrf-token");
      if (!csrfResponse.ok) {
        throw new Error(
          "Failed to fetch CSRF token: HTTP error " + csrfResponse.status,
        );
      }
      const data = await csrfResponse.json();
      if (!data.csrfToken) {
        throw new Error("CSRF token not found in response");
      }
      csrfToken = data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      setMessage("Gagal mendapatkan token keamanan. Mohon coba lagi.");
      setLoading(false);
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

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "Berhasil berlangganan!");
        setIsSuccess(true);
        setCustomerName("");
        setPhoneNumber("");
        setSelectedPlanId("");
        setSelectedMealTypes([]);
        setSelectedDeliveryDays([]);
        setAllergies("");
        setTotalPrice(0);
      } else {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          setMessage(
            "Sesi Anda telah berakhir atau tidak memiliki izin. Silakan login kembali.",
          );
        } else if (response.status === 400 && errorData.errors) {
          const newErrors: Record<string, string> = {};
          errorData.errors.forEach((err: { path: string; message: string }) => {
            newErrors[err.path] = err.message;
          });
          setErrors(newErrors);
          setMessage(
            "Terdapat kesalahan pada input Anda. Silakan periksa kembali.",
          );
        } else {
          setMessage(
            errorData.message || "Gagal berlangganan. Mohon coba lagi.",
          );
        }
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      setMessage("Terjadi masalah koneksi. Mohon coba lagi.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Berlangganan Paket Makanan Sehat
      </h1>

      {message && (
        <div
          className={cn(
            "p-4 rounded-md mb-6 text-center",
            isSuccess
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200",
          )}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto space-y-8"
      >
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="customerName">
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="customerName"
            placeholder="Masukkan nama lengkap Anda"
            value={customerName}
            onChange={handleChange}
            required
            aria-invalid={errors.customerName ? "true" : "false"}
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
          )}
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
            onChange={handleChange}
            required
            aria-invalid={errors.phoneNumber ? "true" : "false"}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-1.5">
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
          {errors.mealTypes && (
            <p className="text-red-500 text-sm mt-1">{errors.mealTypes}</p>
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
          {errors.deliveryDays && (
            <p className="text-red-500 text-sm mt-1">{errors.deliveryDays}</p>
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
            onChange={handleChange}
            aria-invalid={errors.allergies ? "true" : "false"}
          />
          {errors.allergies && (
            <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>
          )}
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
              (!isFormValid || loading) && "opacity-60 cursor-not-allowed",
            )}
            disabled={!isFormValid || loading}
          >
            {loading ? "Memproses..." : "Berlangganan Sekarang"}
          </Button>
        </div>
      </form>
    </div>
  );
}
