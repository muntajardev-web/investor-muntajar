import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-3 text-sm rounded-xl",
  lg: "h-11 px-4 text-sm rounded-xl",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize = "md", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex w-full border border-input bg-card text-foreground transition-colors",
        "placeholder:text-muted-foreground",
        "hover:border-stone-300 dark:hover:border-border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[inputSize],
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export interface SearchInputProps
  extends Omit<InputProps, "type"> {
  onClear?: () => void;
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, value, onClear, ...props }, ref) => (
    <div className={cn("relative", containerClassName)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={ref}
        type="search"
        value={value}
        className={cn("pl-9 pr-9", className)}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  ),
);
SearchInput.displayName = "SearchInput";

export { Input, SearchInput };
