import { BUCKET } from "@/constants/image";
import { createClient } from "@/utils/supabase/client";
import { compressImageToFile } from "@/utils/compressImage";

export const uploadImage = async (file: File, userId: string) => {
  const supabase = createClient();
  const processedFile = await compressImageToFile(file, {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.82,
    mimeType: "image/webp",
  });

  const filePath = `recipe/${userId}/${processedFile.name}_${Date.now()}`;
  const { error } = await supabase.storage.from(BUCKET).upload(filePath, processedFile, {
    cacheControl: "31536000",
    upsert: true,
    contentType: processedFile.type || "image/webp",
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  console.log("public id", data.publicUrl);

  return { url: data.publicUrl, path: filePath };
};

export const deleteImage = async (image_path: string) => {
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([image_path]);
  console.log("from image", error);
  if (error) throw error;
};
