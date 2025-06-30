import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { ContactInfoCard } from "@/src/components/molecules/content/ContactInfoCard";

export function ContactInfoSection() {
  return (
    <section className="mb-16 bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl shadow-lg border border-emerald-200 text-center">
      <h2 className="text-3xl font-bold text-emerald-700 mb-8">
        Detail Kontak
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <ContactInfoCard icon={FaPhone} title="Telepon">
          <a
            href="tel:+628123456789"
            className="text-blue-600 hover:underline text-md"
          >
            08123456789 (Brian, Manager)
          </a>
        </ContactInfoCard>
        <ContactInfoCard icon={FaEnvelope} title="Email">
          <a
            href="mailto:info@seacatering.com"
            className="text-blue-600 hover:underline text-md"
          >
            info@seacatering.com
          </a>
        </ContactInfoCard>
        <ContactInfoCard icon={FaMapMarkerAlt} title="Alamat">
          <p className="text-gray-700 text-md">
            Jl. Contoh Catering No. 123, Surabaya
          </p>
        </ContactInfoCard>
        <ContactInfoCard
          icon={IoTimeOutline}
          title="Jam Operasional"
          className="col-span-full md:col-span-1 md:col-start-2"
        >
          <p className="text-gray-700 text-md">
            Senin - Jumat: 09:00 - 17:00 WIB
          </p>
          <p className="text-gray-700 text-md">Sabtu & Minggu: Tutup</p>
        </ContactInfoCard>
      </div>
    </section>
  );
}
