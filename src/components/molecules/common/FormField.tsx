import React from "react";
import { Input } from "@/src/components/atoms/ui/input";
import { Label } from "@/src/components/atoms/ui/label";
import { Textarea } from "@/src/components/atoms/ui/textarea";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
  type?: "text" | "tel" | "email" | "password";
  placeholder?: string;
  required?: boolean;
  as?: "input" | "textarea";
  disabled?: boolean;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required,
  as = "input",
}: FormFieldProps) {
  const InputComponent = as === "textarea" ? Textarea : Input;
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <InputComponent
        type={type}
        id={id}
        placeholder={placeholder}
        className="text-sm placeholder:text-sm"
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? "true" : "false"}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
