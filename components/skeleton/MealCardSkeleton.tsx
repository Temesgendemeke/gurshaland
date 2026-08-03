import {Card, CardHeader, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

const MealCardSkeleton = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-full overflow-hidden border-border/50 bg-card/50">
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default MealCardSkeleton;