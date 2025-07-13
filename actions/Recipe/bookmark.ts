import { supabase } from "@/lib/supabase-client";




export const toggleBookmark = async(user_id: string, recipe_id: string)=>{
    const {error: deleteError, count} = await supabase
    .from("recipe_bookmark")
    .delete({count:"exact"})
    .eq("user_id", user_id)
    .eq("recipe_id", recipe_id);


    if(deleteError) throw deleteError;

    if(count === 0){
        const {error: insertError} = await supabase
        .from("recipe_bookmark")
        .insert({user_id, recipe_id})

        if(insertError) throw insertError

        return {bookmarked: false}
    }
    return {bookmarked: true}
}