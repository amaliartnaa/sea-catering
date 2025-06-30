import React, { useState } from "react";
import { Input } from "@/src/components/atoms/ui/input";
import { Textarea } from "@/src/components/atoms/ui/textarea";
import { Button } from "@/src/components/atoms/ui/button";
import { RatingStars } from "@/src/components/atoms/RatingStars";
import { SubmissionMessage } from "@/src/components/molecules/common/SubmissionMessage";

interface TestimonialPayload {
  customerName: string;
  reviewMessage: string;
  rating: number;
}

interface TestimonialFormProps {
  onSubmit: (payload: TestimonialPayload) => Promise<boolean>;
  isSubmitting: boolean;
}

export function TestimonialForm({
  onSubmit,
  isSubmitting,
}: TestimonialFormProps) {
  const [reviewCustomerName, setReviewCustomerName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [localSubmissionMessage, setLocalSubmissionMessage] = useState("");
  const [localIsSubmissionSuccess, setLocalIsSubmissionSuccess] =
    useState(false);

  const handleInternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalSubmissionMessage("");
    setLocalIsSubmissionSuccess(false);

    if (!reviewCustomerName || !reviewMessage || rating === 0) {
      setLocalSubmissionMessage(
        "Harap lengkapi semua kolom di formulir testimoni.",
      );
      setLocalIsSubmissionSuccess(false);
      return;
    }

    const payload: TestimonialPayload = {
      customerName: reviewCustomerName,
      reviewMessage,
      rating,
    };
    const success = await onSubmit(payload);

    if (success) {
      setLocalSubmissionMessage(
        "Testimoni Anda berhasil dikirim! Terimakasih atas testimoni Anda :)",
      );
      setLocalIsSubmissionSuccess(true);
      setReviewCustomerName("");
      setReviewMessage("");
      setRating(0);
    } else {
      setLocalSubmissionMessage("Gagal mengirim testimoni. Mohon coba lagi.");
      setLocalIsSubmissionSuccess(false);
    }
  };

  return (
    <form
      onSubmit={handleInternalSubmit}
      className="max-w-xl mx-auto space-y-6"
    >
      <SubmissionMessage
        message={localSubmissionMessage}
        isSuccess={localIsSubmissionSuccess}
      />
      <div>
        <label
          htmlFor="reviewCustomerName"
          className="block text-gray-700 text-sm font-medium mb-2"
        >
          Nama Anda:
        </label>
        <Input
          type="text"
          id="reviewCustomerName"
          value={reviewCustomerName}
          onChange={(e) => setReviewCustomerName(e.target.value)}
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
  );
}
