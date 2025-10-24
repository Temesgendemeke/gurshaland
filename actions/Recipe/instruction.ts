import { BUCKET } from "@/constants/image";
import { createClient } from "@/utils/supabase/client";


const supabase = createClient()

export const uploadInstructionImage = async (
  image_file: File | string,
  user_id: string,
  instruction_id: string
) => {
  try {
    
    const path = `recipe/${user_id}/${image_file.name}_${Date.now()}`;
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .upload(path, image_file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (storageError) throw storageError;

    const {
      data: { publicUrl: url },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const { error } = await supabase.from("instruction_image").insert({
      path,
      url,
      instruction_id,
    });

    console.log(
      "Inserted instruction image with path:",
      path,
      "and url:",
      url
    );

    if (error) throw error;
    return { url, path };
  } catch (error) {
    throw error;
  }
};