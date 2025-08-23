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


export const getSettingProfile = async(id: string)=>{
    const {data, error} = await supabase.rpc("get_setting_profile", {
        _profile_id: id
    })
    if(error) throw error
    console.log(data)
    return data
}


export const deleteAccount = async(profile_id: string) =>{

    // delete if there is recipe or blog delete images first
    // delete profile picture
    // delete user table
    const 

}