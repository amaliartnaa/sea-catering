"use client";

import React from "react";
import Navbar from "@/src/components/organisms/common/Navbar";
import Footer from "@/src/components/organisms/common/Footer";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "sonner";
import { useAuth } from "@/src/context/AuthContext";

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const shouldShowFooter =
    !isLoading && (user === null || user.role !== "admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Toaster position="top-center" />
      {shouldShowFooter && <Footer />}
    </div>
  );
}
