import { GetRestaurentType, RestaurantFormType } from "@/schema/restaurent";
import { createClient } from "@/utils/supabase/client";

export const createRestaurant = async (
    restaurant: RestaurantFormType & { slug?: string },
): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    // In DB schema, the column is named 'review', while forms/schemas often use 'reviews'
    const { reviews, ...rest } = restaurant as any;
    const payload = {
        ...rest,
        review: reviews ?? (restaurant as any).review ?? [],
    };

    const { data, error } = await supabase
        .from("restaurant")
        .insert(payload)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const getRestaurantBySlug = async (
    slug: string,
): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("restaurant")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

export const getRestaurantById = async (
    id: string | number,
): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("restaurant")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

export const updateRestaurant = async (
    restaurant: RestaurantFormType & { id?: string | number; slug?: string },
): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    if (!restaurant?.id) {
        throw new Error("Restaurant ID is required");
    }

    const { reviews, ...rest } = restaurant as any;
    const payload = {
        ...rest,
        ...(reviews !== undefined ? { review: reviews } : {}),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("restaurant")
        .update(payload)
        .eq("id", restaurant.id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const deleteRestaurant = async (
    id: string | number,
): Promise<GetRestaurentType | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("restaurant")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

export const getAllRestaurants = async (
    page: number = 1,
    limit: number = 10,
    searchQuery?: string,
): Promise<{ data: GetRestaurentType[]; count: number } | null> => {
    const supabase = createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("restaurant")
        .select("*", { count: "exact" })
        .range(from, to);

    if (searchQuery && searchQuery.trim()) {
        query = query.ilike("name", `%${searchQuery.trim()}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        throw error;
    }

    return { data: data || [], count: count || 0 };
};
