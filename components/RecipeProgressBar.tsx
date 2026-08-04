import { useState, useEffect } from "react";
import { ChefHat, Brain, Image, CheckCircle } from "lucide-react";
import { Progress } from "./ui/progress";

interface RecipeProgressBarProps {
  isGenerating: boolean;
}

const generationSteps = [
  { id: 1, label: "Analyzing ingredients", icon: ChefHat, duration: 2000 },
  { id: 2, label: "Crafting recipe with AI", icon: Brain, duration: 3000 },
  { id: 3, label: "Generating recipe image", icon: Image, duration: 2500 },
  { id: 4, label: "Finalizing your recipe", icon: CheckCircle, duration: 1000 },
];

export default function RecipeProgressBar({
  isGenerating,
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
    const totalDuration = generationSteps.reduce(
      (sum, step) => sum + step.duration,
      0,
    );

    const interval = setInterval(() => {
      if (stepIndex < generationSteps.length) {
        setCurrentStep(stepIndex);

        // Calculate progress based on time elapsed
        const stepProgress = Math.min(
          100,
          (accumulatedTime / totalDuration) * 100,
        );
        setProgress(stepProgress);

        accumulatedTime += 100; // Update every 100ms

        // Move to next step when current step duration is complete
        if (accumulatedTime >= generationSteps[stepIndex].duration) {
          stepIndex++;
        }
      } else {
        // All steps complete
        setProgress(100);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Creating your recipe
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 bg-muted" />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {generationSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 border border-primary/20"
                  : isCompleted
                    ? "bg-success/10 border border-success/20"
                    : "bg-card border border-border/60"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                      ? "bg-success/15 text-success ring-1 ring-success/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-success"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
