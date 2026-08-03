import { createClient } from "@/utils/supabase/client";

// fetch followers
export const get_followers = async (profile_id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_followers", {
        _profile_id: profile_id,
    });

    if (error) throw error;

    return data;
};
