import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LoadingSkeleton,
  ShimmerSkeleton,
  PulseSkeleton,
  StatsCardSkeleton,
} from "./loading-skeleton";
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";

export function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Loading Animation Demo</h2>
        <Button onClick={toggleLoading} variant="outline">
          {isLoading ? "Hide Loading" : "Show Loading"}
        </Button>
      </div>

      {/* Basic Skeletons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Skeletons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LoadingSkeleton className="h-20 w-full" />
          <ShimmerSkeleton className="h-20 w-full bg-blue-100 dark:bg-blue-900/30" />
          <PulseSkeleton className="h-20 w-full bg-green-100 dark:bg-green-900/30" />
        </div>
      </div>

      {/* Stats Card Skeletons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stats Card Skeletons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      </div>

      {/* Content Skeletons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Content Skeletons</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <LoadingSkeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <LoadingSkeleton className="h-4 w-3/4" />
              <LoadingSkeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-5/6" />
            <LoadingSkeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Animated Elements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <PulseSkeleton className="h-8 w-8 rounded-full" />
              <PulseSkeleton className="h-4 w-24" delay={0.1} />
            </div>
            <PulseSkeleton className="h-3 w-full mb-2" delay={0.2} />
            <PulseSkeleton className="h-3 w-3/4 mb-2" delay={0.3} />
            <PulseSkeleton className="h-3 w-1/2" delay={0.4} />
          </div>

          <div className="p-4 border rounded-lg">
            <ShimmerSkeleton className="h-32 w-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
