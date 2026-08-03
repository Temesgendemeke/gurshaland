import { createClient } from "@/utils/supabase/client";
import { BlogComment } from "@/utils/types/blog";

export const postBlogComment = async (comment: BlogComment) => {
    const supabase = createClient();
    const { data: newComment, error } = await supabase.rpc(
        "post_blog_comment",
        { _comment: comment },
    );

    if (error) throw error;
    return newComment;
};

export const deleteBlogComment = async (comment_id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("blog_comment").delete().eq(
        "id",
        comment_id,
    );
    if (error) throw error;
};
