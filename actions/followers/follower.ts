import { supabase } from "@/lib/supabase-client"


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