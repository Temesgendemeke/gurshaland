import { getMealplanById } from "@/actions/meal/crud"
import { Header } from "@/components/header"
import MealPlanView from "@/components/meal-planner/MealPlanView"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"



export default async function MealPlanPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const queryClient = new QueryClient()


    await queryClient.prefetchQuery({
        queryKey: ['meal-plan', id],
        queryFn: () => getMealplanById(id)
    })
    return <div>
        <Header />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MealPlanView id={id}/>
        </HydrationBoundary>
    </div>
}