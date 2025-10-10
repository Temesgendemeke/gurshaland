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
      0
    );

    const interval = setInterval(() => {
      if (stepIndex < generationSteps.length) {
        setCurrentStep(stepIndex);

        // Calculate progress based on time elapsed
        const stepProgress = Math.min(
          100,
          (accumulatedTime / totalDuration) * 100
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
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Creating Your Recipe
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Our AI chef is working hard to create the perfect recipe for you!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress
          value={progress}
          className="h-3 bg-gray-200 dark:bg-gray-700"
        />
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
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                  : isCompleted
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-500 text-white animate-pulse"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-emerald-700 dark:text-emerald-300"
                    : isCompleted
                    ? "text-green-700 dark:text-green-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"
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
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
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
