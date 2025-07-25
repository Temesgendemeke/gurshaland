import { BUCKET } from "@/constants/image";
import { supabase } from "@/lib/supabase-client";


export const uploadInstructionImage = async (
  image_file: File,
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

    const { data, error } = await supabase.from("instruction_image").insert({
      path,
      url,
      instruction_id,
    });

    console.log(
      "Inserted instruction image:",
      data,
      "with path:",
      path,
      "and url:",
      url
    );

    if (error) throw error;
    console.log("from upload instruction image ", error);
    return data;
  } catch (error) {
    throw error;
  }
};