import { useState, useEffect } from "react";
import { ChefHat, Sparkles, Brain, Image, CheckCircle } from "lucide-react";
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
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/15 ring-1 ring-primary/20 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Creating Your Recipe
        </h3>
        <p className="text-sm text-muted-foreground">
          Our AI chef is working hard to create the perfect recipe for you!
        </p>
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
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 border border-primary/20"
                  : isCompleted
                    ? "bg-success/10 border border-success/20"
                    : "bg-card border border-border/60"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : isCompleted
                      ? "bg-success/15 text-success ring-1 ring-success/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-success"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fun messages */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground italic">
          {currentStep === 0 && "🧅 Chopping onions and gathering spices..."}
          {currentStep === 1 &&
            "🤖 Our AI chef is crafting the perfect recipe..."}
          {currentStep === 2 && "📸 Capturing the perfect food photo..."}
          {currentStep === 3 && "✨ Adding the final touches..."}
        </p>
      </div>
    </div>
  );
}
