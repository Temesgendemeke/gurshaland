import { Skeleton } from "@/components/ui/skeleton";

export default function GenerateSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        {/* Input Fields */}
        <div className="space-y-6">
          {/* Recipe Type */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Result Section Placeholder */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-6 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
      </div>
    </div>
  );
}
