import { cn } from "@/lib/utils";
import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingSkeleton({ className, children }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/50", className)}>
      {children}
    </div>
  );
}

interface ShimmerSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function ShimmerSkeleton({ className, children }: ShimmerSkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {children}
    </div>
  );
}

interface PulseSkeletonProps {
  className?: string;
  delay?: number;
  children?: React.ReactNode;
}

export function PulseSkeleton({
  className,
  delay = 0,
  children,
}: PulseSkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-muted/50 rounded", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

interface StatsCardSkeletonProps {
  className?: string;
}

export function StatsCardSkeleton({ className }: StatsCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border",
        "border-emerald-200/60 dark:border-emerald-800/40",
        "bg-gradient-to-br from-emerald-50/70 via-white to-emerald-100/40",
        "dark:from-gray-900/70 dark:via-gray-900 dark:to-emerald-950/30",
        "shadow-sm p-5 aspect-[5/3]",
        className
      )}
    >
      {/* Animated shimmer effect */}
      <ShimmerSkeleton className="absolute inset-0" />

      {/* decorative gradient bar */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* icon skeleton */}
      <PulseSkeleton className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-emerald-200/50 dark:bg-emerald-800/30" />

      {/* content skeleton */}
      <div className="relative h-full flex flex-col justify-end">
        {/* number skeleton */}
        <PulseSkeleton className="h-20 md:h-16 lg:h-20 w-32 bg-emerald-200/50 dark:bg-emerald-800/30 rounded-lg" />
        {/* name skeleton */}
        <PulseSkeleton
          className="mt-1 h-4 w-20 bg-emerald-200/50 dark:bg-emerald-800/30 rounded"
          delay={0.2}
        />
      </div>

      {/* bottom accent */}
      <span className="absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-emerald-300/0 via-emerald-400/60 to-emerald-300/0 opacity-40" />
    </div>
  );
}
