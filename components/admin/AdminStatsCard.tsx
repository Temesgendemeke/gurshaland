"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatsCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function AdminStatsCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: AdminStatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend.isPositive ? "text-primary" : "text-destructive",
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
