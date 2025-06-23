"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { useAuth } from "@/src/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

export default function Navbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const commonLinks = [
    { name: "Menu / Meal Plans", href: "/menu" },
    { name: "Subscription", href: "/subscription" },
    { name: "Contact Us", href: "/contact" },
  ];

  const loggedOutLinks = [{ name: "Home", href: "/" }, ...commonLinks];

  const loggedInLinks = [
    { name: "Home", href: "/" },
    ...commonLinks,
    { name: "Dashboard", href: "/dashboard" },
  ];

  const displayNavLinks = user ? loggedInLinks : loggedOutLinks;

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutConfirmOpen(false);
    setIsSheetOpen(false);
  };

  return (
    <nav className="bg-emerald-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-3xl font-bold tracking-wide">
          SEA Catering
        </Link>

        <div className="hidden lg:flex items-center space-x-6">
          {displayNavLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button
                variant="ghost"
                className={`text-md transition-colors duration-200 cursor-pointer ${
                  pathname === link.href ? " bg-white text-black" : "text-white"
                }`}
              >
                {link.name}
              </Button>
            </Link>
          ))}
          {!isLoading &&
            (user ? (
              <>
                <Button
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-lg"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-white hover:text-white bg-emerald-800 hover:bg-emerald-800 text-md cursor-pointer"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="text-emerald-800 bg-white text-md cursor-pointer"
                  >
                    Register
                  </Button>
                </Link>
              </>
            ))}
        </div>

        <div className="lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-emerald-800"
              >
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
              className="w-[250px] sm:w-[300px] bg-white text-black border-l border-emerald-700 p-6 flex flex-col"
            >
              <div className="flex flex-col space-y-4 pt-8 flex-grow">
                {displayNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-md py-6 transition-colors duration-200 ${
                        pathname === link.href
                          ? "text-white hover:text-white bg-emerald-700 hover:bg-emerald-700"
                          : " hover:bg-white"
                      }`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>

              {!isLoading && (
                <div className="mt-auto pt-4 border-t border-gray-200 space-y-4">
                  {user ? (
                    <Button
                      onClick={() => {
                        setIsLogoutConfirmOpen(true);
                        setIsSheetOpen(false);
                      }}
                      className="w-full py-6 justify-start text-md bg-red-600 hover:bg-red-700 text-white"
                    >
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-md py-6 bg-emerald-600 hover:bg-emerald-600 text-white hover:text-white"
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
                          className="w-full justify-start text-md border-emerald-800 bg-gray-100 py-6 text-emerald-800 hover:text-emerald-800"
                        >
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Logout</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin keluar dari akun Anda?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
