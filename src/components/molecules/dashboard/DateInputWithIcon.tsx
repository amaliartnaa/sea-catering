import React from "react";
import { Input } from "@/src/components/atoms/ui/input";
import { Label } from "@/src/components/atoms/ui/label";
import { FaRegCalendarAlt } from "react-icons/fa";

interface DateInputWithIconProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function DateInputWithIcon({
  id,
  label,
  value,
  onChange,
  disabled,
}: DateInputWithIconProps) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="block text-gray-700 text-sm font-medium mb-2"
      >
        {label}:
      </Label>
      <div className="relative w-full">
        <Input
          type="date"
          id={id}
          value={value}
          onChange={onChange}
          className="w-full pr-10 appearance-none calendar-icon-none clickable-calendar"
          disabled={disabled}
        />
        <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
