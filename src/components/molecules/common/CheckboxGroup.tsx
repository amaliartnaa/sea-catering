import React from "react";
import { Checkbox } from "@/src/components/atoms/ui/checkbox";
import { Label } from "@/src/components/atoms/ui/label";
import { cn } from "@/src/lib/utils";

interface CheckboxGroupProps<T extends string> {
  label: string;
  options: T[];
  selectedOptions: T[];
  onCheckedChange: (option: T, checked: boolean) => void;
  errorMessage?: string;
  required?: boolean;
  columns?: number;
}

export function CheckboxGroup<T extends string>({
  label,
  options,
  selectedOptions,
  onCheckedChange,
  errorMessage,
  required,
  columns = 1,
}: CheckboxGroupProps<T>) {
  return (
    <div className="grid w-full gap-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div
        className={cn(
          "flex flex-wrap gap-x-6 gap-y-3",
          columns > 1 && `grid-cols-${columns} sm:grid-cols-${columns + 1}`,
        )}
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${option}`}
              checked={selectedOptions.includes(option)}
              onCheckedChange={(checked) =>
                onCheckedChange(option, Boolean(checked))
              }
            />
            <Label htmlFor={`checkbox-${option}`} className="cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
