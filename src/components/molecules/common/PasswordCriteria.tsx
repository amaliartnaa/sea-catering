import React from "react";
import { Check, X } from "lucide-react";

interface PasswordCriteriaProps {
  label: string;
  isValid: boolean;
}

export function PasswordCriteria({ label, isValid }: PasswordCriteriaProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={isValid ? "text-gray-700" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );
}
