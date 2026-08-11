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
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-background/60 to-transparent" />
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
        "border-border/60",
        "bg-card",
        "p-5",
        className,
      )}
    >
      {/* Animated shimmer effect */}
      <ShimmerSkeleton className="absolute inset-0" />

      {/* icon skeleton */}
      <PulseSkeleton className="h-9 w-9 rounded-lg bg-muted" />

      {/* content skeleton */}
      <div className="relative mt-4">
        {/* number skeleton */}
        <PulseSkeleton className="h-10 w-32 bg-muted rounded-lg" />
        {/* name skeleton */}
        <PulseSkeleton
          className="mt-1.5 h-4 w-20 bg-muted rounded"
          delay={0.2}
        />
      </div>
    </div>
  );
}
