import { GetRestaurentType, RestaurantFormType } from "@/schema/restaurent";
import { createClient } from "@/utils/supabase/client";


export const createRestaurant = async (restaurant: RestaurantFormType): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    const {data, error} = await supabase.from('restaurant').insert(restaurant)

    if(error){
        throw error
    }

    return data
};


export const getRestaurantBySlug = async (slug: string): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    const {data, error} = await supabase.from('restaurant').select('*').eq('slug', slug)

    if(error){
        throw error
    }

    return data[0]
};

export const getRestaurantById = async (id: string): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    const {data, error} = await supabase.from('restaurant').select('*').eq('id', id)

    if(error){
        throw error
    }

    return data[0]
};


export const updateRestaurant = async (restaurant: RestaurantFormType): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    if (!restaurant?.id) {
        throw new Error('Restaurant ID is required')
    }

    const {data, error} = await supabase.from('restaurant').update(restaurant).eq('id', restaurant?.id)

    if(error){
        throw error
    }

    return data
};


export const deleteRestaurant = async (id: string): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    const {data, error} = await supabase.from('restaurant').delete().eq('id', id)

    if(error){
        throw error
    }

    return data
};


export const getAllRestaurants = async (
    page: number = 1,
    limit: number = 10
): Promise<{ data: GetRestaurentType[]; count: number } | null> => {
    const supabase = createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("restaurant")
        .select("*", { count: "exact" })
        .range(from, to);

    if (error) {
        throw error;
    }

    return { data: data || [], count: count || 0 };
};
