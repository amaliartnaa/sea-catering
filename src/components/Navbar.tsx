"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu / Meal Plans", href: "/menu" },
    { name: "Subscription", href: "/subscription" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="bg-emerald-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-3xl font-bold tracking-wide">
          SEA Catering
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button
                variant="ghost"
                className={`text-lg transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                {link.name}
              </Button>
            </Link>
          ))}
          {!isLoading &&
            (user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white text-lg"
                >
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white text-lg"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white text-lg"
                >
                  <Button variant="ghost">Login</Button>
                </Link>
              </>
            ))}
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[250px] sm:w-[300px] bg-emerald-800 text-white border-l border-emerald-700 p-6"
            >
              <div className="flex flex-col space-y-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-xl transition-colors duration-200 ${
                        pathname === link.href
                          ? "text-white bg-emerald-700"
                          : "text-gray-300 hover:text-white hover:bg-emerald-700"
                      }`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
                {!isLoading &&
                  (user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-xl text-gray-300 hover:text-white hover:bg-emerald-700"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          logout();
                          setIsSheetOpen(false);
                        }}
                        className="w-full justify-start bg-red-600 hover:bg-red-700 text-white text-xl"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-xl text-gray-300 hover:text-white hover:bg-emerald-700"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start text-xl text-white border-white hover:bg-white hover:text-emerald-800"
                        >
                          Register
                        </Button>
                      </Link>
                    </>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
