import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-orange-500 ml-0.5">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2;
}

export function FormGroup({
  columns = 1,
  className,
  children,
  ...props
}: FormGroupProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
