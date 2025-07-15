import { supabase } from "@/lib/supabase-client";



export const getProfilebyUsername = async(username: string)=>{
    const {data, error} = await supabase.rpc("get_profile_by_username", 
        {
            _username: username
        }
    )



    if(error) throw error

    console.log(error);
    console.log(data);
    return data
}