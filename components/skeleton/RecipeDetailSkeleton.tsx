import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RecipeDetailSkeleton() {
  return (
    <div className="w-full md:max-w-9xl mx-auto px-6 py-12">
      {/* Back Navigation Skeleton */}
      <Button
        variant="ghost"
        className="mb-6 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
        disabled
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <Skeleton className="h-4 w-32 inline-block" />
      </Button>

      {/* Recipe Header Skeleton */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div>
          <Skeleton className="w-full h-96 rounded-2xl shadow-lg" />
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
          <Skeleton className="h-10 w-2/3 mb-4 rounded" />
          <Skeleton className="h-6 w-full mb-6 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-6 mx-auto mb-2 rounded-full" />
                <Skeleton className="h-4 w-20 mx-auto mb-2 rounded" />
                <Skeleton className="h-6 w-16 mx-auto rounded" />
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-32 mb-2 rounded" />
                <Skeleton className="h-4 w-48 mb-1 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recipe Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Ingredients Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-8 w-40 mb-6 rounded" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded" />
              ))}
            </div>
          </Card>
          {/* Instructions Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-8 w-40 mb-6 rounded" />
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-32 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2 rounded" />
                    <Skeleton className="h-4 w-full mb-2 rounded" />
                    <Skeleton className="h-4 w-24 mb-2 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {/* Cultural Note Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-8 w-40 mb-4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </Card>
        </div>
        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Nutrition Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4 rounded" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between mb-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            ))}
          </Card>
          {/* Rating Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4 rounded" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </Card>
          {/* Comments Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4 rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 mb-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2 rounded" />
                  <Skeleton className="h-4 w-full mb-2 rounded" />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
