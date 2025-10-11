import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


// fetch followers
export const get_followers = async(profile_id: string)=>{
    const {data, error} = await supabase.rpc("get_followers",
        {
            _profile_id: profile_id
        }
    )

    if(error) throw error;

    return data
}