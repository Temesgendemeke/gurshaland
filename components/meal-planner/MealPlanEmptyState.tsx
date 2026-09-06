import React from "react";
import { AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MealPlanEmptyStateProps {
  error?: string | null;
  onRetry?: () => void;
}

export default function MealPlanEmptyState({
  error,
  onRetry,
}: MealPlanEmptyStateProps) {
  if (error) {
    return (
      <div className="w-full border-y border-error/30 px-1 py-8">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-error"
            strokeWidth={1.75}
          />
          <div>
            <h3 className="font-gosh text-lg font-semibold tracking-tight text-foreground">
              Couldn&apos;t generate your meal plan
            </h3>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {error}
            </p>
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                className="mt-5 rounded-md"
                onClick={onRetry}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center self-stretch rounded-xl p-8 text-center min-h-[16rem] lg:min-h-0">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Calendar className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 font-gosh text-lg font-semibold tracking-tight text-foreground">
        Your meal plan will appear here
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Set a timeframe, goal, and diet then generate to see your full
        Ethiopian menu, nutrition breakdown, and shopping list.
      </p>
    </div>
  );
}
