"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { Blog } from "@/utils/types/blog";

export const getBookmarkedBlogs = async (user_id: string): Promise<Blog[]> => {
  const supabase = await createServerClient();

  // Try RPC first if available
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_bookmarked_blogs", {
      _user_id: user_id,
    });

    if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
      return rpcData.map((row: any) => row.blog || row) as Blog[];
    }
    if (!rpcError && Array.isArray(rpcData) && rpcData.length === 0) {
      return [];
    }
  } catch (err) {
    console.warn("get_bookmarked_blogs RPC fallback:", err);
  }

  // Fallback: Query blog_bookmark table directly
  const { data: bookmarks, error: bookmarkError } = await supabase
    .from("blog_bookmark")
    .select("blog_id")
    .eq("user_id", user_id);

  if (bookmarkError) {
    console.error("Error fetching blog bookmarks:", bookmarkError);
    return [];
  }
  if (!bookmarks || bookmarks.length === 0) return [];

  const blogIds = bookmarks.map((b) => b.blog_id);

  const { data: blogs, error: blogError } = await supabase
    .from("blog")
    .select(`
      id,
      title,
      subtitle,
      author_id,
      created_at,
      read_time,
      category,
      tags,
      slug,
      status
    `)
    .in("id", blogIds)
    .eq("status", "published");

  if (blogError) {
    console.error("Error fetching bookmarked blog details:", blogError);
    return [];
  }

  const blogList = (blogs || []) as any[];
  const authorIds = [...new Set(blogList.map((b) => b.author_id).filter(Boolean))];

  const [{ data: authors }, { data: images }, { data: profileImages }] = await Promise.all([
    authorIds.length > 0
      ? supabase.from("profile").select("id, username, full_name").in("id", authorIds)
      : Promise.resolve({ data: [] }),
    supabase.from("blog_image").select("blog_id, url, path").in("blog_id", blogIds),
    authorIds.length > 0
      ? supabase.from("profile_image").select("profile_id, url").in("profile_id", authorIds)
      : Promise.resolve({ data: [] }),
  ]);

  const imgMap = new Map((profileImages || []).map((pi: any) => [pi.profile_id, pi.url]));
  const authorMap = new Map(
    (authors || []).map((a: any) => {
      const resolvedAvatar = imgMap.get(a.id) || null;
      return [a.id, { ...a, avatar: resolvedAvatar, avatar_url: resolvedAvatar }];
    })
  );
  const imageMap = new Map((images || []).map((img: any) => [img.blog_id, img]));

  return blogList.map((blog) => ({
    ...blog,
    author: authorMap.get(blog.author_id) || null,
    image: imageMap.get(blog.id) || null,
  })) as Blog[];
};

export const toggleBlogBookmark = async (
  user_id: string,
  blog_id: string | number
): Promise<{ bookmarked: boolean }> => {
  const supabase = await createServerClient();

  let numericId = typeof blog_id === "number" ? blog_id : parseInt(String(blog_id), 10);
  if (isNaN(numericId)) {
    const { data: b } = await supabase
      .from("blog")
      .select("id")
      .eq("slug", String(blog_id))
      .maybeSingle();
    if (b?.id) {
      numericId = b.id;
    } else {
      throw new Error("Invalid blog identifier");
    }
  }

  const { error: deleteError, count } = await supabase
    .from("blog_bookmark")
    .delete({ count: "exact" })
    .eq("user_id", user_id)
    .eq("blog_id", numericId);

  if (deleteError) throw deleteError;

  if (count === 0) {
    const { error: insertError } = await supabase
      .from("blog_bookmark")
      .insert({ user_id, blog_id: numericId });

    if (insertError) throw insertError;
    return { bookmarked: true };
  }

  return { bookmarked: false };
};

export const isBlogBookmarked = async (
  user_id: string,
  blog_id: string | number
): Promise<boolean> => {
  const supabase = await createServerClient();

  let numericId = typeof blog_id === "number" ? blog_id : parseInt(String(blog_id), 10);
  if (isNaN(numericId)) {
    const { data: b } = await supabase
      .from("blog")
      .select("id")
      .eq("slug", String(blog_id))
      .maybeSingle();
    if (b?.id) {
      numericId = b.id;
    } else {
      return false;
    }
  }

  const { data, error } = await supabase
    .from("blog_bookmark")
    .select("id")
    .eq("user_id", user_id)
    .eq("blog_id", numericId)
    .maybeSingle();

  if (error) {
    console.error("Error checking blog bookmark:", error);
    return false;
  }

  return Boolean(data);
};
