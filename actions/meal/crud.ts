import { mealPlannerType } from "@/schema/meal-planner";
import { createClient } from "@/utils/supabase/client"
import { HandleError } from "@/utils/supabase/safe-request";


export const saveMealplan = async (mealPlan: mealPlannerType) => {
    const supabase = createClient();

    const {data, error} =  await supabase.rpc('save_meal_plan', {
        _meal_plan: mealPlan
    })

    if(error){
        throw error
    }

    return data
}


export const getMealplansByAuthorId = async (authorId: string) => {
    const supabase = createClient();

    const {data, error} = await supabase.rpc('get_meal_plan_by_author_id', {
        _author_id: authorId
    })

    if(error){
        throw error
    }

    return data
}


export const getMealplanById = async (mealPlanId: string) => {
    const supabase = createClient();

    const {data, error} = await supabase.rpc('get_meal_plan_by_id', {
        _meal_plan_id: mealPlanId
    })

    if(error){
        throw error
    }

    return data
}


export const deleteMealplan = async (id: string) =>{
    const supabase = createClient();

    const {data, error} = await supabase.from('meal_plan').delete().eq('id', id)

    if (error){
        throw error
    }

    return {success: true, data}
}



export const update_mealplan = async (mealPlan: any) => {
    const supabase = createClient();

    const { data, error } = await supabase.rpc('update_mealplan', {
        _meal_plan: mealPlan
    })

    if (error) {
        throw error
    }

    return data
}