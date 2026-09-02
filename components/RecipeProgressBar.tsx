import { useState, useEffect } from "react";
import { ChefHat, Brain, Image, CheckCircle } from "lucide-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface RecipeProgressBarProps {
  isGenerating: boolean;
  title?: string;
  steps?: { id: number; label: string; icon: any; duration: number }[];
}

const defaultSteps = [
  { id: 1, label: "Analyzing ingredients", icon: ChefHat, duration: 2000 },
  { id: 2, label: "Crafting recipe with AI", icon: Brain, duration: 3000 },
  { id: 3, label: "Generating recipe image", icon: Image, duration: 2500 },
  { id: 4, label: "Finalizing your recipe", icon: CheckCircle, duration: 1000 },
];

export default function RecipeProgressBar({
  isGenerating,
  title = "Creating your recipe",
  steps = defaultSteps,
}: RecipeProgressBarProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let accumulatedTime = 0;
    const totalDuration = steps.reduce(
      (sum, step) => sum + step.duration,
      0,
    );

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);

        const stepProgress = Math.min(
          100,
          (accumulatedTime / totalDuration) * 100,
        );
        setProgress(stepProgress);

        accumulatedTime += 100;

        if (accumulatedTime >= steps[stepIndex].duration) {
          stepIndex++;
        }
      } else {
        setProgress(100);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="mx-auto w-full max-w-md space-y-7 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
            In progress
          </p>
          <h3 className="mt-1 font-gosh text-lg font-bold tracking-tight text-foreground">
            {title}
          </h3>
        </div>
        <span className="text-sm font-semibold tabular-nums text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      <Progress value={progress} className="h-1.5 bg-muted" />

      <ol className="space-y-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <li key={step.id} className="flex">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                {index < steps.length - 1 && (
                  <span
                    className={cn(
                      "w-px flex-1 min-h-5",
                      isCompleted ? "bg-primary/30" : "bg-border",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "pb-4 pl-4 text-sm font-medium leading-8 transition-colors",
                  isActive
                    ? "text-foreground"
                    : isCompleted
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
