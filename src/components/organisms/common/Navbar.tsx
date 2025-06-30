"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/atoms/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/atoms/ui/sheet";
import { useAuth } from "@/src/context/AuthContext";

import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaEnvelope,
  FaTachometerAlt,
  FaUserCog,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/atoms/ui/alert-dialog";

interface NavLinkItem {
  name: string;
  href: string;
  icon?: IconType;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const commonLinks: NavLinkItem[] = [
    { name: "Menu / Meal Plans", href: "/menu", icon: FaUtensils },
    { name: "Subscription", href: "/subscription", icon: FaClipboardList },
    { name: "Contact Us", href: "/contact", icon: FaEnvelope },
  ];

  const loggedOutLinks: NavLinkItem[] = [
    { name: "Home", href: "/", icon: FaHome },
    ...commonLinks,
  ];

  let loggedInLinksBasedOnRole: NavLinkItem[];
  if (user?.role === "admin") {
    loggedInLinksBasedOnRole = [
      { name: "Admin Dashboard", href: "/admin/dashboard", icon: FaUserCog },
    ];
  } else {
    loggedInLinksBasedOnRole = [
      { name: "Dashboard", href: "/dashboard", icon: FaTachometerAlt },
      ...commonLinks,
    ];
  }

  const displayNavLinks = user ? loggedInLinksBasedOnRole : loggedOutLinks;

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutConfirmOpen(false);
    setIsSheetOpen(false);
  };

  return (
    <nav className="bg-emerald-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-emerald-800"
              >
                <RxHamburgerMenu className="!h-8 !w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[250px] sm:w-[300px] bg-white text-black border-r border-emerald-700 p-6 flex flex-col"
            >
              <SheetHeader>
                <SheetTitle className="text-2xl text-gray-800">
                  SEA Catering Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 flex-grow">
                {isLoading ? (
                  <div className="text-gray-600">Memuat...</div>
                ) : (
                  <>
                    {displayNavLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-md py-6 transition-colors duration-200 flex items-center gap-3 ${
                            pathname === link.href
                              ? "text-white bg-emerald-700 hover:bg-emerald-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {link.icon && <link.icon className="h-5 w-5" />}
                          {link.name}
                        </Button>
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {!isLoading && (
                <div className="mt-auto pt-4 border-t border-gray-200 space-y-4">
                  {user ? (
                    <Button
                      onClick={() => {
                        setIsLogoutConfirmOpen(true);
                        setIsSheetOpen(false);
                      }}
                      className="w-full py-6 justify-start text-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-3"
                    >
                      <FiLogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-md py-6 bg-emerald-600 hover:bg-emerald-600 text-white hover:text-white flex items-center gap-3"
                        >
                          <FiLogIn className="h-5 w-5" />
                          Login
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start text-md border-emerald-800 bg-gray-100 py-6 text-emerald-800 hover:text-emerald-800 flex items-center gap-3"
                        >
                          <FiUserPlus className="h-5 w-5" />
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

        <div className="flex-grow gap-2 flex justify-center lg:justify-start mr-5 sm:mr-0 lg:items-center">
          <Link href="/" className="group flex items-center gap-2">
            {" "}
            <Image src="/images/logo.png" width={50} height={50} alt="logo" />
            <span className="text-white text-3xl font-bold tracking-wide flex flex-col items-start leading-none">
              <span>SEA</span>
              <span className="text-xl -mt-1">Catering</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
          {isLoading ? (
            <div className="text-white">Memuat...</div>
          ) : (
            <>
              {displayNavLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`text-md transition-colors duration-200 cursor-pointer ${
                      pathname === link.href
                        ? " bg-white text-black"
                        : "text-white"
                    }`}
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
              {user ? (
                <Button
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-md"
                >
                  Logout
                </Button>
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
              )}
            </>
          )}
        </div>
      </div>

      <AlertDialog
        open={isLogoutConfirmOpen}
        onOpenChange={setIsLogoutConfirmOpen}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun Anda?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Ya, Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
