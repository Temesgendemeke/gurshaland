"use client"
import { getMealplansByAuthorId } from "@/actions/meal/crud"
import { useAuth } from "@/store/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Button } from "../ui/button"
import Link from "next/link"
import MealCardSkeleton from "../skeleton/MealCardSkeleton"
import MealPlanCard from "./MealPlanCard"
import { Utensils } from "lucide-react"

const MealPlanList = () => {
    const user = useAuth(store => store.user)

    const { data: plans, isLoading } = useQuery({
        queryKey: ['meal-plans', user?.id],
        queryFn: async () => {
            if (!user?.id) return []
            return await getMealplansByAuthorId(user.id)
        },
        enabled: !!user?.id
    })

    if (isLoading) {
        return (
            <MealCardSkeleton />
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col items-center mb-12 space-y-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground">
                    My Meal Plans
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl text-center">
                    Manage and track your personalized nutrition journeys.
                </p>
            </div>

            {!isLoading && plans?.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/25">
                    <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                        <Utensils className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No meal plans yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first meal plan to get started on your health journey.</p>
                    <Button asChild>
                        <Link href="/meal-planner">Create Meal Plan</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans?.map((plan: any) => (
                        <MealPlanCard key={'plan-list-' + plan.id} plan={plan} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MealPlanList