import { Skeleton } from "@/components/ui/skeleton";

const MealCardSkeleton = () => {
    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-border/80 bg-card">
                        <div className="space-y-2 border-b border-border/80 p-5">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="space-y-3 p-5">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MealCardSkeleton
