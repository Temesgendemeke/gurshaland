import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

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
      .limit(1);
  
    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      break;
    }

  
    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
};
