"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  showTooltip?: boolean;
  tooltipContent?: (value: number) => React.ReactNode;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = [0],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      showTooltip = false,
      tooltipContent,
      ...props
    },
    ref
  ) => {
    const currentValue = value ? value[0] : defaultValue[0];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      onValueChange?.([val]);
    };

    const percentage = Math.min(
      100,
      Math.max(0, ((currentValue - min) / (max - min)) * 100)
    );

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center py-2", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #e7e5e4 ${percentage}%, #e7e5e4 100%)`,
          }}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";
