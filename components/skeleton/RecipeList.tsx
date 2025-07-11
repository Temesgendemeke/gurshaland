import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeListSkeleton() {
  return (
    <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="modern-card modern-card-hover">
          <div className="relative">
            <Skeleton className="w-full h-48 rounded-lg object-cover" />
            <div className="absolute top-4 left-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-8 rounded" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <Skeleton className="h-6 w-2/3 mb-2 rounded" />
            <Skeleton className="h-4 w-full mb-4 rounded" />
            <div className="flex items-center justify-between text-sm text-body-muted mb-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-16 h-4 rounded" />
                <Skeleton className="w-12 h-4 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
