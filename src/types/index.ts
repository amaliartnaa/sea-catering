export type MealPlan = {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  image?: string;
};

export type Testimonial = {
  id: string;
  customerName: string;
  reviewMessage: string;
  rating: number;
};
