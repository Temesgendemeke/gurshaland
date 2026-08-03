import { Skeleton } from "@/components/ui/skeleton"

const MealPlanSkeleton = () => (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
        <div className="space-y-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        </div>
    </div>
)



export default MealPlanSkeleton