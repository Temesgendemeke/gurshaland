import { BUCKET } from "@/constants/image";
import { supabase } from "@/lib/supabase-client";


export const uploadImage = async (file: File, userId: string) => {
  const filePath = `recipe/${userId}/${file.name}_${Date.now()}`;
  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  console.log("public id", data.publicUrl);

  return { url: data.publicUrl, path: filePath };
};

export const deleteImage = async (image_path: string) => {
  const { error } = await supabase.storage.from(BUCKET).remove([image_path]);
  console.log("from image", error);
  if (error) throw error;
};




