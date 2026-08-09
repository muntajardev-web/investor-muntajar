import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    isComplete && "bg-accent text-accent-foreground",
                    isCurrent && "border-2 border-accent bg-card text-accent",
                    !isComplete &&
                      !isCurrent &&
                      "border border-border bg-card text-muted-foreground",
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </span>
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-medium truncate max-w-[6rem]",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 min-w-[1rem]",
                    isComplete ? "bg-accent" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
