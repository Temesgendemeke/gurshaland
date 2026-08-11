import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border/60 bg-card"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="p-5 sm:p-6">
            <Skeleton className="mb-3 h-3 w-16 rounded-full" />
            <Skeleton className="mb-2 h-5 w-3/4 rounded" />
            <Skeleton className="mb-5 h-4 w-full rounded" />
            <Skeleton className="mb-5 h-3 w-40 rounded" />
            <div className="flex items-center justify-between border-t border-border/70 pt-4">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-2.5 w-14 rounded" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
