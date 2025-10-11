import { createClient } from "@/utils/supabase/client";


const supabase = createClient()

export const postOrDeleteLike = async (liked_by: string, recipe_id: string) => {
    const { error: deleteError, count } = await supabase
        .from("recipe_like")
        .delete({ count: 'exact' }) 
        .eq("liked_by", liked_by)
        .eq("recipe_id", recipe_id);

    if (deleteError) {
        console.log(deleteError);
        
        throw deleteError}

    if (count === 0) {
        const { error: insertError } = await supabase
            .from("recipe_like")
            .insert({ liked_by, recipe_id });

        if (insertError) {
            console.log(insertError);
            throw insertError
        }

        return { liked: true };
    }

    return { liked: false };
};

