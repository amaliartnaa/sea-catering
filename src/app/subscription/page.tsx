"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { toast } from "sonner";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);

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

  const proceedSubscription = useCallback(async () => {
    setErrors({});
    setLoading(true);
    setIsConfirmDialogOpen(false);

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
      toast.error("Gagal mendapatkan token keamanan. Mohon coba lagi.");
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
        toast.success(
          "Langganan berhasil dibuat! Silakan lihat di dashboard Anda untuk detail lebih lanjut.",
          {
            // description: "Pesanan Anda sedang diproses. Terima kasih!",
            duration: 5000,
          },
        );
        setCustomerName("");
        setPhoneNumber("");
        setSelectedPlanId("");
        setSelectedMealTypes([]);
        setSelectedDeliveryDays([]);
        setAllergies("");
        setTotalPrice(0);
      } else {
        const errorData = await response.json();
        let errorMessage = "Gagal berlangganan. Mohon coba lagi.";
        if (response.status === 401 || response.status === 403) {
          errorMessage =
            "Sesi Anda telah berakhir atau tidak memiliki izin. Silakan login kembali.";
        } else if (response.status === 400 && errorData.errors) {
          const newErrors: Record<string, string> = {};
          errorData.errors.forEach((err: { path: string; message: string }) => {
            newErrors[err.path] = err.message;
          });
          setErrors(newErrors);
          errorMessage =
            "Terdapat kesalahan pada input Anda. Silakan periksa kembali.";
        } else {
          errorMessage =
            errorData.message || "Gagal berlangganan. Mohon coba lagi.";
        }
        toast.error("Gagal Berlangganan!", {
          description: errorMessage,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Network or server error:", error);
      toast.error("Terjadi masalah koneksi. Mohon coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [
    customerName,
    phoneNumber,
    selectedPlanId,
    selectedMealTypes,
    selectedDeliveryDays,
    allergies,
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

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!isFormValid) {
      toast.error("Validasi Gagal!", {
        description: "Harap lengkapi semua kolom yang wajib diisi (*).",
        duration: 3000,
      });
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const currentPlan = MEAL_PLANS.find((plan) => plan.id === selectedPlanId);

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-3xl lg:text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Berlangganan Paket Makanan Sehat
      </h1>

      <form
        onSubmit={handlePreSubmit}
        className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto space-y-8"
      >
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="customerName">
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="customerName"
            placeholder="Masukkan nama lengkap Anda"
            className="text-sm placeholder:text-sm"
            value={customerName}
            onChange={handleChange}
            required
            aria-invalid={errors.customerName ? "true" : "false"}
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="phoneNumber">
            Nomor Telepon Aktif <span className="text-red-500">*</span>
          </Label>
          <Input
            type="tel"
            id="phoneNumber"
            placeholder="Contoh: 081234567890"
            className="text-sm placeholder:text-sm"
            value={phoneNumber}
            onChange={handleChange}
            required
            aria-invalid={errors.phoneNumber ? "true" : "false"}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

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

        <div className="grid w-full gap-2">
          <Label htmlFor="allergies">
            Alergi / Pembatasan Diet Lainnya (Opsional)
          </Label>
          <Textarea
            id="allergies"
            className="text-sm placeholder:text-sm"
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
              "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-md lg:text-lg py-3 px-10 rounded-full cursor-pointer",
              (!isFormValid || loading) && "opacity-60 cursor-not-allowed",
            )}
            disabled={!isFormValid || loading}
          >
            {loading ? "Memproses..." : "Berlangganan Sekarang"}
          </Button>
        </div>
      </form>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Berlangganan</DialogTitle>
            <DialogDescription>
              Mohon periksa kembali detail langganan Anda sebelum melanjutkan.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3 text-sm">
            <p>
              <span className="font-semibold">Nama Pelanggan:</span>{" "}
              {customerName}
            </p>
            <p>
              <span className="font-semibold">Nomor Telepon:</span>{" "}
              {phoneNumber}
            </p>
            <p>
              <span className="font-semibold">Paket Terpilih:</span>{" "}
              {currentPlan?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Jenis Makanan:</span>{" "}
              {selectedMealTypes.join(", ") || "Belum dipilih"}
            </p>
            <p>
              <span className="font-semibold">Hari Pengiriman:</span>{" "}
              {selectedDeliveryDays.join(", ") || "Belum dipilih"}
            </p>
            {allergies && (
              <p>
                <span className="font-semibold">Alergi/Diet:</span> {allergies}
              </p>
            )}
            <p className="text-lg font-bold text-emerald-800 pt-2">
              Total Pembayaran: Rp{totalPrice.toLocaleString("id-ID")}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={loading}
            >
              Masih Pilih Lagi
            </Button>
            <Button
              type="button"
              onClick={proceedSubscription}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Memproses..." : "Ya, Saya Yakin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
