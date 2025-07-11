import { supabase } from "@/lib/supabase-client";

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const generateUniqueSlug = async (title: string, table: string) => {
  let base = slugify(title);
  let slug = base;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .eq("slug", slug)
      .single();

    if (error || !data) break;
    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
};
