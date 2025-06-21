"use client";

import React, { useState } from "react";
import { SAMPLE_TESTIMONIALS } from "@/src/lib/constants";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

const RatingStars = ({
  rating,
  setRating,
  editable = false,
}: {
  rating: number;
  setRating?: (r: number) => void;
  editable?: boolean;
}) => (
  <div className="flex justify-center mb-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={cn(
          "w-6 h-6",
          star <= rating ? "text-yellow-400" : "text-gray-300",
          editable ? "cursor-pointer hover:text-yellow-500" : "",
        )}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        onClick={editable ? () => setRating?.(star) : undefined}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.961a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.453a1 1 0 00-.364 1.118l1.287 3.961c.3.921-.755 1.688-1.539 1.118l-3.374-2.453a1 1 0 00-1.176 0l-3.374 2.453c-.784.57-1.838-.197-1.539-1.118l1.287-3.961a1 1 0 00-.364-1.118L2.05 9.388c-.783-.57-.381-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.961z" />
      </svg>
    ))}
  </div>
);

export default function ContactPage() {
  const [customerName, setCustomerName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !reviewMessage || rating === 0) {
      alert("Harap lengkapi semua kolom testimoni.");
      return;
    }

    console.log({ customerName, reviewMessage, rating });
    alert("Testimoni Anda telah diterima! (Belum disimpan ke database)");
    setCustomerName("");
    setReviewMessage("");
    setRating(0);
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex(
      (prevIndex) => (prevIndex + 1) % SAMPLE_TESTIMONIALS.length,
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex(
      (prevIndex) =>
        (prevIndex - 1 + SAMPLE_TESTIMONIALS.length) %
        SAMPLE_TESTIMONIALS.length,
    );
  };

  const currentTestimonial = SAMPLE_TESTIMONIALS[currentTestimonialIndex];

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Hubungi Kami & Testimoni Pelanggan
      </h1>

      <section className="mb-16 bg-white p-10 rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-4xl font-bold text-emerald-700 mb-6">
          Informasi Kontak
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Manager: <span className="font-semibold">Brian</span>
        </p>
        <p className="text-lg text-gray-700">
          Nomor Telepon: <span className="font-semibold">08123456789</span>
        </p>
        <p className="mt-6 text-gray-600 text-md">
          Jangan ragu untuk menghubungi kami untuk pertanyaan, saran, atau
          bantuan lebih lanjut!
        </p>
      </section>

      <section className="mb-16 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-emerald-700 mb-8 text-center">
          Bagikan Pengalaman Anda!
        </h2>
        <form
          onSubmit={handleSubmitTestimonial}
          className="max-w-xl mx-auto space-y-6"
        >
          <div>
            <label
              htmlFor="customerName"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Nama Anda:
            </label>
            <Input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Lengkap"
              required
            />
          </div>
          <div>
            <label
              htmlFor="reviewMessage"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Pesan Ulasan:
            </label>
            <Textarea
              id="reviewMessage"
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              rows={5}
              placeholder="Ceritakan pengalaman Anda dengan SEA Catering..."
              required
            />
          </div>
          <div className="text-center">
            <label className="block text-gray-700 text-sm font-medium mb-3">
              Rating (1-5 Bintang):
            </label>
            <RatingStars rating={rating} setRating={setRating} editable />
          </div>
          <div className="text-center">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-lg py-3 px-8 rounded-full"
            >
              Kirim Testimoni
            </Button>
          </div>
        </form>
      </section>

      <section className="bg-emerald-50 p-10 rounded-xl shadow-lg border border-emerald-200 relative">
        <h2 className="text-4xl font-bold text-emerald-700 mb-8 text-center">
          Apa Kata Pelanggan Kami
        </h2>
        {currentTestimonial && (
          <Card className="max-w-2xl mx-auto bg-white shadow-md p-6 text-center">
            <CardHeader>
              {" "}
              <CardTitle className="text-xl font-bold text-emerald-900 mb-2">
                Testimoni dari {currentTestimonial.customerName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Rating: {currentTestimonial.rating} bintang
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-2xl italic text-gray-800 mb-4 leading-relaxed">
                &quot;{currentTestimonial.reviewMessage}&quot;
              </p>
              <RatingStars rating={currentTestimonial.rating} />
            </CardContent>
          </Card>
        )}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full w-12 h-12 bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-100"
          >
            &#8592;
          </Button>
          <p className="text-lg text-gray-600">
            Testimoni {currentTestimonialIndex + 1} dari{" "}
            {SAMPLE_TESTIMONIALS.length}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full w-12 h-12 bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-100"
          >
            &#8594;
          </Button>
        </div>
      </section>
    </div>
  );
}
