import { createClient } from "@/utils/supabase/client";
import { BlogComment } from "@/utils/types/blog";

export const postBlogComment = async (
  comment: Partial<BlogComment> & { comment: string; blog_id: string | number; user_id?: string; author_id?: string }
) => {
  const supabase = createClient();
  const userId = comment.user_id || comment.author_id;

  // Try RPC first if it exists in Supabase
  try {
    const { data: newComment, error } = await supabase.rpc("post_blog_comment", {
      _comment: { ...comment, user_id: userId },
    });
    if (!error && newComment) {
      return newComment;
    }
  } catch (err) {
    console.warn("post_blog_comment RPC fallback:", err);
  }

  // Direct insert fallback
  const { data, error } = await supabase
    .from("blog_comment")
    .insert({
      blog_id: comment.blog_id,
      user_id: userId,
      comment: comment.comment,
    })
    .select(`
      id,
      blog_id,
      user_id,
      comment,
      created_at
    `)
    .single();

  if (error) throw error;

  if (data?.user_id) {
    const [{ data: prof }, { data: pImg }] = await Promise.all([
      supabase
        .from("profile")
        .select("id, username, full_name")
        .eq("id", data.user_id)
        .maybeSingle(),
      supabase
        .from("profile_image")
        .select("url")
        .eq("profile_id", data.user_id)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const resolvedAvatar = pImg?.url || null;

    return {
      ...data,
      author: prof
        ? {
            ...prof,
            avatar: resolvedAvatar,
            avatar_url: resolvedAvatar,
          }
        : null,
    };
  }

  return data;
};

export const getBlogComments = async (blog_id: string | number) => {
  const supabase = createClient();
  const { data: comments, error } = await supabase
    .from("blog_comment")
    .select(`
      id,
      blog_id,
      user_id,
      comment,
      created_at
    `)
    .eq("blog_id", blog_id)
    .order("created_at", { ascending: false });

  if (error || !comments) {
    return [];
  }

  const userIds = [...new Set(comments.map((c) => c.user_id).filter(Boolean))];
  const [{ data: profiles }, { data: profileImages }] = await Promise.all([
    userIds.length > 0
      ? supabase.from("profile").select("id, username, full_name").in("id", userIds)
      : Promise.resolve({ data: [] }),
    userIds.length > 0
      ? supabase.from("profile_image").select("profile_id, url").in("profile_id", userIds)
      : Promise.resolve({ data: [] }),
  ]);

  const imgMap = new Map((profileImages || []).map((img: any) => [img.profile_id, img.url]));
  const profileMap = new Map(
    (profiles || []).map((p: any) => {
      const resolvedAvatar = imgMap.get(p.id) || null;
      return [p.id, { ...p, avatar: resolvedAvatar, avatar_url: resolvedAvatar }];
    })
  );

  return comments.map((c) => ({
    ...c,
    author: profileMap.get(c.user_id) || null,
  }));
};

export const deleteBlogComment = async (comment_id: string | number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_comment")
    .delete()
    .eq("id", comment_id);
  if (error) throw error;
  return data;
};

export const updateBlogComment = async (comment_id: string | number, newComment: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_comment")
    .update({ comment: newComment })
    .eq("id", comment_id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

