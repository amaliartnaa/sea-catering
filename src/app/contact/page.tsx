"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { Testimonial } from "@/src/types/index";
import { SAMPLE_TESTIMONIALS } from "@/src/lib/constants";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

const RatingStars = ({
  rating,
  setRating,
  editable = false,
}: {
  rating: number;
  setRating?: (r: number) => void;
  editable?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentFillLevel = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex justify-center mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={cn(
            "w-6 h-6",
            star <= currentFillLevel ? "text-yellow-400" : "text-gray-300",
            editable ? "cursor-pointer hover:text-yellow-500" : "",
          )}
          fill="currentColor"
          onMouseEnter={editable ? () => setHoverRating(star) : undefined}
          onMouseLeave={editable ? () => setHoverRating(0) : undefined}
          onClick={editable ? () => setRating?.(star) : undefined}
        />
      ))}
    </div>
  );
};

export default function ContactPage() {
  const [customerName, setCustomerName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [displayedTestimonials, setDisplayedTestimonials] = useState<
    Testimonial[]
  >([]);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDisplayedTestimonials(SAMPLE_TESTIMONIALS.slice(0, 5));
  }, []);

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !reviewMessage || rating === 0) {
      setSubmissionMessage("Harap lengkapi semua kolom testimoni.");
      setIsSubmissionSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage("");

    let csrfToken;
    try {
      const csrfResponse = await fetch(`/api/csrf-token`);
      if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
      const { csrfToken: fetchedCsrfToken } = await csrfResponse.json();
      csrfToken = fetchedCsrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      setSubmissionMessage(
        "Gagal mendapatkan token keamanan. Mohon coba lagi.",
      );
      setIsSubmissionSuccess(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/testimonials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ customerName, reviewMessage, rating }),
      });

      if (response.ok) {
        setSubmissionMessage(
          "Testimoni Anda berhasil dikirim! Terimakasih atas testimoni Anda:)",
        );
        setIsSubmissionSuccess(true);

        setCustomerName("");
        setReviewMessage("");
        setRating(0);
      } else {
        setSubmissionMessage("Gagal mengirim testimoni. Mohon coba lagi.");
        setIsSubmissionSuccess(false);
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setSubmissionMessage("Terjadi masalah koneksi saat mengirim testimoni.");
      setIsSubmissionSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    if (displayedTestimonials.length === 0) return;
    setCurrentTestimonialIndex(
      (prevIndex) => (prevIndex + 1) % displayedTestimonials.length,
    );
  };

  const prevTestimonial = () => {
    if (displayedTestimonials.length === 0) return;
    setCurrentTestimonialIndex(
      (prevIndex) =>
        (prevIndex - 1 + displayedTestimonials.length) %
        displayedTestimonials.length,
    );
  };

  const currentTestimonial = displayedTestimonials[currentTestimonialIndex];

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-12">
        Testimoni Pelanggan
      </h1>

      <section className="mb-16 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-emerald-700 mb-8 text-center">
          Bagikan Pengalaman Anda!
        </h2>
        <form
          onSubmit={handleSubmitTestimonial}
          className="max-w-xl mx-auto space-y-6"
        >
          {submissionMessage && (
            <div
              className={cn(
                "p-3 rounded-md text-center",
                isSubmissionSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {submissionMessage}
            </div>
          )}
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
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-lg py-3 px-8 rounded-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Testimoni"}
            </Button>
          </div>
        </form>
      </section>

      <section className="mb-16 bg-emerald-50 p-10 rounded-xl shadow-lg border border-emerald-200 relative">
        <h2 className="text-4xl font-bold text-emerald-700 mb-8 text-center">
          Apa Kata Pelanggan Kami
        </h2>
        {displayedTestimonials.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            Belum ada testimoni. Jadilah yang pertama!
          </p>
        ) : (
          <Card className="max-w-2xl mx-auto bg-white shadow-md sm:p-6 text-center">
            <CardContent className="flex flex-col items-center">
              <p className="sm:text-2xl italic text-gray-800 mb-4 leading-relaxed">
                {currentTestimonial?.reviewMessage}
              </p>
              <p className="font-bold text-xl text-emerald-900 mb-2">
                - {currentTestimonial?.customerName}
              </p>
              <RatingStars rating={currentTestimonial?.rating || 0} />
            </CardContent>
          </Card>
        )}
        {displayedTestimonials.length > 1 && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full w-12 h-12 bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-100 cursor-pointer"
            >
              <FaArrowLeft />
            </Button>
            <p className="sm:text-lg text-gray-600">
              {currentTestimonialIndex + 1} dari {displayedTestimonials.length}
            </p>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full w-12 h-12 bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-100 cursor-pointer"
            >
              <FaArrowRight />
            </Button>
          </div>
        )}
      </section>

      <section className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 text-center">
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
    </div>
  );
}
