import React from "react";
import { Skeleton } from "../ui/skeleton";

const BlogPageSkeleton = () => {
  return (
    <div className="mt-10">
      {/* Featured post */}
      <Skeleton className="h-72 w-full rounded-xl sm:h-96 md:h-[440px]" />

      {/* Section header */}
      <div className="mt-16 mb-8 border-b border-border/70 pb-5">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-border/60">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-5 sm:p-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPageSkeleton;
