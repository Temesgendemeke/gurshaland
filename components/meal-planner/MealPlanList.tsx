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
        <div className="mx-auto w-full  px-4 py-10 sm:px-6">
            <div className="mb-8  pb-6 border-b ">
                <h1 className="font-gosh text-3xl font-bold tracking-tight text-foreground  sm:text-6xl lg:text-7xl leading-[1.04] tracking-tighter">
                    My Meal Plans
                </h1>
                <p className=" text-sm text-muted-foreground mt-2 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                    Your saved plans, ready when you are.
                </p>
            </div>

            {!isLoading && plans?.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
                    <Utensils className="mb-4 h-6 w-6 text-muted-foreground/40" />
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        No meal plans yet
                    </h3>
                    <p className="mb-6 mt-1 max-w-sm text-sm text-muted-foreground">
                        Create your first meal plan to get started on your health journey.
                    </p>
                    <Button asChild>
                        <Link href="/meal-planner">Create Meal Plan</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans?.map((plan: any) => (
                        <MealPlanCard key={'plan-list-' + plan.id} plan={plan} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MealPlanList
