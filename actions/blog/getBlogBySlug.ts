"use server";

import { createClient } from "@/utils/supabase/server";

export const getBlogBySlug = async (slug: string, user_id?: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_blog_by_slug", {
    blog_slug: slug,
    _user_id: user_id ?? null,
  });

  if (error) throw error;

  return data;
};
