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