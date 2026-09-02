import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RecipeDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-6">
      {/* Back Navigation Skeleton */}
      <Button variant="ghost" className="mb-6 hover:bg-muted/50" disabled>
        <ArrowLeft className="w-4 h-4 mr-2" />
        <Skeleton className="h-4 w-32 inline-block" />
      </Button>

      {/* Recipe Header Skeleton */}
      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
        <Skeleton className="h-96 w-full rounded-2xl" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-9 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-6 border-t border-border pt-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-5 w-14 rounded" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-12 pt-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Instructions Skeleton */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-5 w-16 rounded" />
            </div>
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-6">
                  <Skeleton className="h-5 w-8 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients Skeleton */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="divide-y divide-border/80 rounded-xl border border-border/80">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Note Skeleton */}
          <div className="rounded-xl border border-border/80">
            <Skeleton className="h-12 w-full rounded-t-xl" />
            <Skeleton className="h-16 w-full rounded-b-xl" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Nutrition Skeleton */}
          <div className="rounded-xl border border-border/80">
            <Skeleton className="h-12 w-full rounded-t-xl" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between border-t border-border/80 px-4 py-2.5"
              >
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-10 rounded" />
              </div>
            ))}
          </div>

          {/* Rating Skeleton */}
          <div className="space-y-4 rounded-xl border border-border/80 p-5">
            <Skeleton className="h-5 w-36 rounded" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-7 w-7 rounded-md" />
              ))}
            </div>
          </div>

          {/* Comments Skeleton */}
          <div className="space-y-4 rounded-xl border border-border/80 p-5">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 pt-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
