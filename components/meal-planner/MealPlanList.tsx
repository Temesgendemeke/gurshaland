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
        <div className="mx-auto w-full max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-gosh text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                        My Meal Plans
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Your saved personalized Ethiopian nutrition programs, ready when you are.
                    </p>
                </div>
                {plans && plans.length > 0 && (
                    <Button asChild size="sm" className="h-9 px-4 text-xs font-semibold self-start sm:self-auto shadow-none">
                        <Link href="/meal-planner">Create New Plan</Link>
                    </Button>
                )}
            </div>

            {!isLoading && plans?.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 sm:py-24 text-center px-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <Utensils className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-foreground font-gosh">
                        No meal plans yet
                    </h3>
                    <p className="mb-6 mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Create your first tailored meal plan with AI to get started on your nutritional journey.
                    </p>
                    <Button asChild size="sm" className="h-9 px-4 text-xs font-semibold shadow-none">
                        <Link href="/meal-planner">Create Meal Plan</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {plans?.map((plan: any) => (
                        <MealPlanCard key={'plan-list-' + plan.id} plan={plan} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MealPlanList
