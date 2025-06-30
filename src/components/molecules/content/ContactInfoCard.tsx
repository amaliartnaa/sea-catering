import { cn } from "@/src/lib/utils";
import React from "react";

interface ContactInfoCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ContactInfoCard({
  icon: Icon,
  title,
  children,
  className,
}: ContactInfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-100",
        className,
      )}
    >
      <Icon className="w-10 h-10 text-emerald-600 mb-3" />
      <p className="font-semibold text-lg text-gray-800">{title}</p>
      {children}
    </div>
  );
}
