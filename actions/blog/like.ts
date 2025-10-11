import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


export const toggleBlogLike = async(user_id: string, blog_id: string)=>{
    const {error, count} = await supabase
    .from("blog_like")
    .delete({count:"exact"})
    .eq("blog_id", blog_id)
    .eq("liked_by", user_id)

    if(error) throw error
    
    
    if(count === 0){
        const {error} = await supabase
        .from("blog_like")
        .insert({liked_by: user_id, blog_id})
        
        if(error) throw error
        return true
    }else{
        return false
    }
}