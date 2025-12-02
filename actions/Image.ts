import { createClient } from "@/utils/supabase/client";
import { BUCKET } from "@/constants/image";

const deleteImageFromStorage = async (pathArray: string[]) => {
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove(pathArray);
  if (error) throw error;
  return { success: true };
};

export const deleteImageFromDb = async (
  table_name: "blog_image" | "content_image",
  path: string,
  id?: string,
) => {
  const supabase = createClient();
  const col_name = table_name == "blog_image" ? "blog_id" : "content_id";
  if (id) {
    const { error } = await supabase.from(table_name).delete().eq(col_name, id);
    if (error) throw error;
  }
  await deleteImageFromStorage([path]);
  return { success: true };
};

export default deleteImageFromStorage;
