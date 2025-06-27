export interface Subscription {
  id: string;
  customerName: string;
  phoneNumber: string;
  planId: string;
  plan: {
    id: string;
    name: string;
    price: number;
    description: string;
    details?: string;
    image?: string;
  };
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string | null;
  totalPrice: number;
  status: "active" | "paused" | "cancelled";
  pauseStartDate: string | null;
  pauseEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}
