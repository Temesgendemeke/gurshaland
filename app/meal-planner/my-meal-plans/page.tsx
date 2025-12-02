import { Header } from "@/components/header"
import { getMealplansByAuthorId } from "@/actions/meal/crud"
import { useAuth } from "@/store/useAuth"
import MealPlanList from "@/components/meal-planner/MealPlanList"

const MyMealPlansPage = () => {

    return (
        <>
            <Header />
            <div className="flex flex-col gap-4">
                <MealPlanList />
            </div>
        </>
    )
}

export default MyMealPlansPage;