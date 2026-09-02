import { Skeleton } from "@/components/ui/skeleton";

const MealPlanSkeleton = () => (
  <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
    <div className="space-y-3">
      <Skeleton className="h-8 w-72 max-w-full rounded-xl" />
      <Skeleton className="h-4 w-48 max-w-full rounded-xl" />
    </div>
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      <div className="space-y-6 lg:col-span-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
      <div className="space-y-6 lg:col-span-4">
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default MealPlanSkeleton;
