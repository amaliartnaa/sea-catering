import React from "react";
import { cn } from "@/src/lib/utils";

interface SubmissionMessageProps {
  message: string;
  isSuccess: boolean;
}

export function SubmissionMessage({
  message,
  isSuccess,
}: SubmissionMessageProps) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "p-3 rounded-md text-center",
        isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
      )}
    >
      {message}
    </div>
  );
}
