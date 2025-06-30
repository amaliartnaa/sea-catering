"use client";

import React, { useState, useCallback } from "react";
import { ContactInfoSection } from "@/src/components/organisms/contact-page/ContactInfoSection";
import { TestimonialForm } from "@/src/components/organisms/contact-page/TestimonialForm";

interface TestimonialPayload {
  customerName: string;
  reviewMessage: string;
  rating: number;
}

export default function ContactPage() {
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);

  const fetchCsrfToken = useCallback(async () => {
    try {
      const csrfResponse = await fetch(`/api/csrf-token`);
      if (!csrfResponse.ok) {
        throw new Error("Failed to fetch CSRF token: " + csrfResponse.status);
      }
      const { csrfToken } = await csrfResponse.json();
      if (!csrfToken) {
        throw new Error("CSRF token not found in response.");
      }
      return csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      return null;
    }
  }, []);

  const handleFormSubmission = useCallback(
    async (
      endpoint: string,
      payload: TestimonialPayload,
      formType: "contact" | "testimonial",
    ) => {
      setIsSubmittingTestimonial(true);

      try {
        const csrfToken = await fetchCsrfToken();
        if (!csrfToken) return false;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`API Error (${endpoint}):`, errorData);
          return false;
        }
        return true;
      } catch (error) {
        console.error(
          `Network or server error submitting ${formType} form:`,
          error,
        );
        return false;
      } finally {
        setIsSubmittingTestimonial(false);
      }
    },
    [fetchCsrfToken],
  );

  const handleSubmitTestimonialForm = useCallback(
    async (payload: TestimonialPayload) => {
      return handleFormSubmission("/api/testimonials", payload, "testimonial");
    },
    [handleFormSubmission],
  );

  return (
    <div className="container mx-auto p-8 py-12">
      <h1 className="text-5xl font-extrabold text-center text-emerald-800 mb-6">
        Hubungi Kami
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Kami siap membantu Anda! Hubungi kami melalui kontak dibawah ini atau
        bagikan pengalaman Anda bersama SEA Catering.
      </p>

      <ContactInfoSection />

      <section className="mt-16 mb-16 bg-white p-8 rounded-xl shadow-lg border border-emerald-200">
        <h2 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
          Bagikan Pengalaman Anda!
        </h2>
        <p className="text-md text-gray-600 text-center mb-6">
          Suka dengan layanan kami? Tinggalkan ulasan jujur Anda di sini untuk
          meningkatkan pelayanan kami!
        </p>
        <TestimonialForm
          onSubmit={handleSubmitTestimonialForm}
          isSubmitting={isSubmittingTestimonial}
        />
      </section>
    </div>
  );
}
