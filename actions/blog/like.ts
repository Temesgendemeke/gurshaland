import { createClient } from "@/utils/supabase/client";

export const toggleBlogLike = async (user_id: string, blog_id: string | number) => {
  const supabase = createClient();
  const numericId = typeof blog_id === "number" ? blog_id : parseInt(String(blog_id), 10);

  // Optimistically attempt delete first
  const { error: deleteError, count } = await supabase
    .from("blog_like")
    .delete({ count: "exact" })
    .eq("blog_id", numericId)
    .eq("liked_by", user_id);

  if (deleteError) {
    console.error("Error deleting blog like:", deleteError);
    throw deleteError;
  }

  if (count === 0) {
    const { error: insertError } = await supabase
      .from("blog_like")
      .insert({ liked_by: user_id, blog_id: numericId });

    if (insertError) {
      console.error("Error inserting blog like:", insertError);
      throw insertError;
    }
    return { liked: true };
  }

  return { liked: false };
};

export const getBlogLikeStatus = async (user_id: string, blog_id: string | number) => {
  const supabase = createClient();
  const numericId = typeof blog_id === "number" ? blog_id : parseInt(String(blog_id), 10);

  const { data, error } = await supabase
    .from("blog_like")
    .select("id")
    .eq("blog_id", numericId)
    .eq("liked_by", user_id)
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
};

export const getBlogLikesCount = async (blog_id: string | number) => {
  const supabase = createClient();
  const numericId = typeof blog_id === "number" ? blog_id : parseInt(String(blog_id), 10);

  const { count, error } = await supabase
    .from("blog_like")
    .select("*", { count: "exact", head: true })
    .eq("blog_id", numericId);

  if (error) return 0;
  return count ?? 0;
};
