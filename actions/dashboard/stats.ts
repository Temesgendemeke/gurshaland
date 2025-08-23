import { supabase } from "@/lib/supabase-client"


//  get count of followers, recipe, blog
export const getStatus = async(profile_id: string)=>{
    const {data, error} = await supabase.rpc("get_stats", {
        _profile_id: profile_id
    })

    if(error) throw error
    return data
}