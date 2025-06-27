"use client";

import React from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { useAuth } from "@/src/context/AuthContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, isLoading } = useAuth();

  const commonLinks = [
    { name: "Menu / Meal Plans", href: "/menu" },
    { name: "Subscription", href: "/subscription" },
    { name: "Contact Us", href: "/contact" },
  ];

  let exploreLinks;
  if (user) {
    if (user.role === "admin") {
      exploreLinks = [{ name: "Admin Dashboard", href: "/admin/dashboard" }];
      exploreLinks = [
        { name: "Admin Dashboard", href: "/admin/dashboard" },
        ...commonLinks,
      ];
    } else {
      exploreLinks = [
        { name: "Dashboard", href: "/dashboard" },
        ...commonLinks,
      ];
    }
  } else {
    exploreLinks = [{ name: "Home", href: "/" }, ...commonLinks];
  }

  return (
    <footer className="bg-emerald-800 text-white p-8 md:p-12 shadow-inner mt-auto">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex justify-between text-center md:text-left w-full mb-8 md:mb-12">
          <div className="text-left lg:text-left">
            <h3 className="text-xl lg:text-2xl font-semibold mb-4 border-b-2 border-emerald-600 pb-2 inline-block">
              Hubungi Kami
            </h3>
            <p className="text-md lg:text-lg mb-2">Manager: Brian</p>
            <p className="text-md lg:text-lg">Phone: 08123456789</p>
          </div>

          <div className="md:col-span-1 text-left lg:text-left">
            <h3 className="text-xl lg:text-2xl font-semibold mb-4 border-b-2 border-emerald-600 pb-2 inline-block">
              Jelajahi
            </h3>
            <ul className="space-y-2 text-md">
              {isLoading ? (
                <li>Memuat...</li>
              ) : (
                exploreLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-emerald-300 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="hidden lg:block">
            <p className="text-3xl font-bold text-center">SEA Catering</p>
            <p className="text-xl italic text-center mt-2">
              &quot;Healthy Meals, Anytime, Anywhere&quot;
            </p>
          </div>
        </div>

        <div className="border-t border-emerald-600 pt-8 mt-auto w-full text-center lg:flex justify-between items-center">
          <div className="flex justify-center space-x-6 mb-4 lg:mb-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl hover:text-emerald-300 transition-colors duration-200"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl hover:text-emerald-300 transition-colors duration-200"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl hover:text-emerald-300 transition-colors duration-200"
            >
              <FaInstagram />
            </a>
          </div>
          <p className="text-md text-gray-300">
            &copy; {currentYear} SEA Catering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
