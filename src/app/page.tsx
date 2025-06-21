import React from "react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-6 shadow-lg">
        <div className="container mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-3">
            SEA Catering
          </h1>
          <p className="text-xl md:text-2xl italic font-light">
            &quot;Healthy Meals, Anytime, Anywhere&quot;
          </p>
        </div>
      </header>

      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="/images/hero-catering.jpg"
          alt="Healthy meals delivered"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center p-4">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Solusi Makanan Sehat untuk Gaya Hidup Modern Anda
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up delay-200">
              SEA Catering menyediakan pilihan hidangan bergizi yang dapat
              disesuaikan, dikirim langsung ke seluruh penjuru Indonesia. Mulai
              hidup sehat Anda bersama kami!
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto p-8 py-16 flex-grow">
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center text-emerald-700 mb-12">
            Mengapa Memilih Kami?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 text-center">
              <div className="text-emerald-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                Kustomisasi Menu Tanpa Batas
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Pilih bahan, porsi, dan preferensi diet Anda. Sesuaikan hidangan
                Anda agar benar-benar sesuai dengan gaya hidup dan selera unik
                Anda.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 text-center">
              <div className="text-emerald-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                Pengiriman Nasional Cepat
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Kami bangga melayani pengiriman ke berbagai kota besar di
                seluruh Indonesia. Makanan sehat Anda tiba tepat waktu, di mana
                pun Anda berada.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 text-center">
              <div className="text-emerald-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
                Informasi Gizi Transparan
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Setiap hidangan dilengkapi dengan detail informasi gizi. Buat
                pilihan yang cerdas dan pantau asupan Anda dengan mudah.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-emerald-800 text-white p-8 text-center shadow-inner mt-auto">
        <div className="container mx-auto">
          <h3 className="text-2xl font-semibold mb-3">Hubungi Kami</h3>
          <p className="text-lg mb-1">Manager: Brian</p>
          <p className="text-lg">Phone Number: 08123456789</p>
          <p className="mt-6 text-sm text-gray-300">
            &copy; {new Date().getFullYear()} SEA Catering. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
