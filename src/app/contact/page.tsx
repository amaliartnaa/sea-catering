"use client";

import React, { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

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

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface TestimonialPayload {
  customerName: string;
  reviewMessage: string;
  rating: number;
}

export default function ContactPage() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [reviewCustomerName, setReviewCustomerName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(0);

  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (
    e: React.FormEvent,
    formType: "contact" | "testimonial",
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage("");

    let payload: ContactPayload | TestimonialPayload;
    let endpoint: string;
    let successMsg: string;
    let errorMsg: string;

    if (formType === "contact") {
      if (!contactName || !contactEmail || !contactMessage) {
        setSubmissionMessage(
          "Harap lengkapi semua kolom wajib di formulir kontak.",
        );
        setIsSubmissionSuccess(false);
        setIsSubmitting(false);
        return;
      }
      payload = {
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
      };
      endpoint = `/api/contact`;
      successMsg =
        "Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.";
      errorMsg = "Gagal mengirim pesan. Mohon coba lagi.";
    } else {
      if (!reviewCustomerName || !reviewMessage || rating === 0) {
        setSubmissionMessage(
          "Harap lengkapi semua kolom di formulir testimoni.",
        );
        setIsSubmissionSuccess(false);
        setIsSubmitting(false);
        return;
      }
      payload = { customerName: reviewCustomerName, reviewMessage, rating };
      endpoint = `/api/testimonials`;
      successMsg =
        "Testimoni Anda berhasil dikirim! Terimakasih atas testimoni Anda :)";
      errorMsg = "Gagal mengirim testimoni. Mohon coba lagi.";
    }

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
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmissionMessage(successMsg);
        setIsSubmissionSuccess(true);
        if (formType === "contact") {
          setContactName("");
          setContactEmail("");
          setContactSubject("");
          setContactMessage("");
        } else {
          setReviewCustomerName("");
          setReviewMessage("");
          setRating(0);
        }
      } else {
        setSubmissionMessage(errorMsg);
        setIsSubmissionSuccess(false);
      }
    } catch (error) {
      console.error(`Error submitting ${formType} form:`, error);
      setSubmissionMessage(
        `Terjadi masalah koneksi saat mengirim ${formType === "contact" ? "pesan" : "testimoni"}.`,
      );
      setIsSubmissionSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-6">
        Hubungi Kami
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Kami siap membantu Anda! Hubungi kami melalui kontak dibawah ini atau
        bagikan pengalaman Anda bersama SEA Catering.
      </p>

      <section className="mb-16 bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl shadow-lg border border-emerald-200 text-center">
        <h2 className="text-3xl font-bold text-emerald-700 mb-8">
          Detail Kontak
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <FaPhone className="w-10 h-10 text-emerald-600 mb-3" />
            <p className="font-semibold text-lg text-gray-800">Telepon</p>
            <a
              href="tel:+628123456789"
              className="text-blue-600 hover:underline text-md"
            >
              08123456789 (Brian, Manager)
            </a>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <FaEnvelope className="w-10 h-10 text-emerald-600 mb-3" />
            <p className="font-semibold text-lg text-gray-800">Email</p>
            <a
              href="mailto:info@seacatering.com"
              className="text-blue-600 hover:underline text-md"
            >
              info@seacatering.com
            </a>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <FaMapMarkerAlt className="w-10 h-10 text-emerald-600 mb-3" />
            <p className="font-semibold text-lg text-gray-800">Alamat</p>
            <p className="text-gray-700 text-md">
              Jl. Contoh Catering No. 123, Surabaya
            </p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-100 col-span-full md:col-span-1 md:col-start-2">
            <IoTimeOutline className="w-10 h-10 text-emerald-600 mb-3" />
            <p className="font-semibold text-lg text-gray-800">
              Jam Operasional
            </p>
            <p className="text-gray-700 text-md">
              Senin - Jumat: 09:00 - 17:00 WIB
            </p>
            <p className="text-gray-700 text-md">Sabtu & Minggu: Tutup</p>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-xl shadow-lg border border-emerald-200">
        <h2 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
          Bagikan Pengalaman Anda!
        </h2>
        <p className="text-md text-gray-600 text-center mb-6">
          Suka dengan layanan kami? Tinggalkan ulasan jujur Anda di sini untuk
          meingkatkan pelayanan kami!
        </p>
        <form
          onSubmit={(e) => handleSubmitForm(e, "testimonial")}
          className="max-w-xl mx-auto space-y-6"
        >
          {submissionMessage && isSubmissionSuccess && (
            <div className="p-3 rounded-md text-center bg-green-100 text-green-700">
              {submissionMessage}
            </div>
          )}
          {submissionMessage && !isSubmissionSuccess && (
            <div className="p-3 rounded-md text-center bg-red-100 text-red-700">
              {submissionMessage}
            </div>
          )}
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
      </section>
    </div>
  );
}
