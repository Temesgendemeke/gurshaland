import { BUCKET } from "@/constants/image";
import { createClient } from "@/utils/supabase/client";
import { compressImageToFile } from "@/utils/compressImage";

export async function deleteUserImages(imagePaths: string[]) {
  const supabase = createClient();
  try {
    if (!imagePaths || imagePaths.length === 0) {
      return {
        success: true,
        deletedImages: [],
        errors: [],
        totalDeleted: 0,
        totalErrors: 0,
      };
    }

    // Delete all images at once using the paths array
    const { error } = await supabase.storage
      .from("gurshaland-bucket")
      .remove(imagePaths);

    if (error) {
      return {
        success: false,
        deletedImages: [],
        errors: [error.message],
        totalDeleted: 0,
        totalErrors: 1,
      };
    }

    return {
      success: true,
      deletedImages: imagePaths,
      errors: [],
      totalDeleted: imagePaths.length,
      totalErrors: 0,
    };
  } catch (error) {
    return {
      success: false,
      deletedImages: [],
      errors: [`General error: ${error}`],
      totalDeleted: 0,
      totalErrors: 1,
    };
  }
}

export async function deleteUserImagesBatch(
  imagePaths: string[],
  batchSize: number = 50,
) {
  const supabase = createClient();
  try {
    if (!imagePaths || imagePaths.length === 0) {
      return {
        success: true,
        deletedImages: [],
        errors: [],
        totalDeleted: 0,
        totalErrors: 0,
      };
    }

    const deletedImages: string[] = [];
    const errors: string[] = [];

    // Delete in batches
    for (let i = 0; i < imagePaths.length; i += batchSize) {
      const batch = imagePaths.slice(i, i + batchSize);

      try {
        const { error } = await supabase.storage
          .from("gurshaland-bucket")
          .remove(batch);

        if (error) {
          errors.push(
            `Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`,
          );
        } else {
          deletedImages.push(...batch);
        }
      } catch (error) {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      deletedImages,
      errors,
      totalDeleted: deletedImages.length,
      totalErrors: errors.length,
    };
  } catch (error) {
    return {
      success: false,
      deletedImages: [],
      errors: [`General error: ${error}`],
      totalDeleted: 0,
      totalErrors: 1,
    };
  }
}

export const getSettingProfile = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_setting_profile", {
    _profile_id: id,
  });
  if (error) throw error;
  console.log(data);
  return data;
};

export const updateProfile = async (profile_id: string, profileData: {
  full_name?: string;
  username?: string;
  bio?: string;
  image?: { url: string; path: string };
}) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("change_profile_info", {
    _profile_id: profile_id,
    _new_profile: profileData,
  });

  if (error) throw error;
  return data;
};

export const deleteAccount = async (profile_id: string) => {
  const supabase = createClient();
  // Get image paths from your function
  const { data, error } = await supabase.rpc("get_user_images", {
    _profile_id: profile_id,
  });
  if (error) throw error;
  const imagePaths = data.image_paths || [];

  const result = await deleteUserImagesBatch(imagePaths, 100);

  if (result.success) {
    console.log(`Successfully deleted ${result.totalDeleted} images`);
  } else {
    console.log("Errors:", result.errors);
  }

  const { data: userData, error: DeletionError } = await supabase.rpc(
    "delete_user_complete",
    {
      _profile_id: profile_id,
    },
  );

  if (DeletionError) throw DeletionError;
  console.log("user data ", userData);
};

// upsert profile picture
export const upsertProfilePicure = async (
  user_id: string,
  image_file: File,
) => {
  const supabase = createClient();
  const processedFile = await compressImageToFile(image_file, {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.85,
    mimeType: "image/webp",
  });

  const path = `profile_picture/${user_id}-${processedFile.name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(
    path,
    processedFile,
    {
      upsert: true,
      cacheControl: "31536000",
      contentType: processedFile.type || "image/webp",
    },
  );

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  console.log("public id", data.publicUrl);

  return { url: data.publicUrl, path };
};

//  delete profile picture
export const deleteProfilePicture = async (
  profile_id: string,
  image_path: string,
) => {
  const supabase = createClient();

  // Delete the profile image row for the given profile_id and path
  const { error } = await supabase
    .from("profile_image")
    .delete()
    .eq("profile_id", profile_id)
    .eq("path", image_path);

  if (error) throw error;

  // Remove the image from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([image_path]);
  if (storageError) throw storageError;
};

//  remove a profile picture file from storage without touching the database
export const removeProfilePictureFile = async (image_path: string) => {
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([image_path]);
  if (error) throw error;
};
