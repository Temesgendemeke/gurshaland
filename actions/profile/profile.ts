import { BUCKET } from "@/constants/image";
import { supabase } from "@/lib/supabase-client";



export const getProfilebyUsername = async(username: string)=>{
    const {data, error} = await supabase.rpc("get_profile_by_username", 
        {
            _username: username
        }
    )

    if(error) throw error

    console.log(error);
    console.log(data);
    return data
}


export async function deleteUserImages(imagePaths: string[]) {
    try {
      if (!imagePaths || imagePaths.length === 0) {
        return {
          success: true,
          deletedImages: [],
          errors: [],
          totalDeleted: 0,
          totalErrors: 0
        };
      }
  
      // Delete all images at once using the paths array
      const { error } = await supabase.storage
        .from('gurshaland-bucket')
        .remove(imagePaths);
  
      if (error) {
        return {
          success: false,
          deletedImages: [],
          errors: [error.message],
          totalDeleted: 0,
          totalErrors: 1
        };
      }
  
      return {
        success: true,
        deletedImages: imagePaths,
        errors: [],
        totalDeleted: imagePaths.length,
        totalErrors: 0
      };
  
    } catch (error) {
      return {
        success: false,
        deletedImages: [],
        errors: [`General error: ${error}`],
        totalDeleted: 0,
        totalErrors: 1
      };
    }
  }
  
  export async function deleteUserImagesBatch(imagePaths: string[], batchSize: number = 50) {    
    try {
      if (!imagePaths || imagePaths.length === 0) {
        return {
          success: true,
          deletedImages: [],
          errors: [],
          totalDeleted: 0,
          totalErrors: 0
        };
      }
  
      const deletedImages: string[] = [];
      const errors: string[] = [];
  
      // Delete in batches
      for (let i = 0; i < imagePaths.length; i += batchSize) {
        const batch = imagePaths.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase.storage
            .from('gurshaland-bucket')
            .remove(batch);
          
          if (error) {
            errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
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
        totalErrors: errors.length
      };
  
    } catch (error) {
      return {
        success: false,
        deletedImages: [],
        errors: [`General error: ${error}`],
        totalDeleted: 0,
        totalErrors: 1
      };
    }
  }


export const getSettingProfile = async(id: string)=>{
    const {data, error} = await supabase.rpc("get_setting_profile", {
        _profile_id: id
    })
    if(error) throw error
    console.log(data)
    return data
}

export const updateProfile = async(profile_id: string, profileData: {
    full_name?: string;
    username?: string;
    bio?: string;
    image_url?: string;
}) => {
    const { data, error } = await supabase.rpc("change_profile_info", {
        _profile_id: profile_id,
        _new_profile: profileData
    });
    
    if (error) throw error;
    return data;
}

export const deleteAccount = async(profile_id: string) =>{
    // Get image paths from your function
    const { data, error } = await supabase.rpc('get_user_images', { _profile_id: profile_id });
    if (error) throw error
    const imagePaths = data.image_paths || [];
    
    const result = await deleteUserImagesBatch(imagePaths, 100);
    
    if (result.success) {
      console.log(`Successfully deleted ${result.totalDeleted} images`);
    } else {
      console.log('Errors:', result.errors);
    }
    
    const {data: userData,  error: DeletionError } = await supabase.rpc("delete_user_complete", {
        _profile_id: profile_id
    });
    
    if(DeletionError) throw DeletionError
    console.log("user data ", userData)
}



// upsert profile picture
export const upsertProfilePicure = async(user_id: string, image_file: File) => {
    const path = `profile_picture/${user_id}-${image_file.name}`
    const {error} = await supabase.storage.from(BUCKET).upload(path, image_file, {
       upsert: true,
       cacheControl:"3600"
    })

    if(error) throw error

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    console.log("public id", data.publicUrl);
  
    return { url: data.publicUrl, path };

}


//  delete profile picture
export const deleteProfilePicture = async (profile_id: string, image_path: string) => {
  // Delete the profile image row for the given profile_id
  const { error, data, count } = await supabase
    .from('profile_image')
    .delete()
    .eq('profile_id', profile_id);

  if (error) throw error;

  // If any rows were deleted, also remove the image from storage
  // Supabase JS v2: .delete() returns { data, error }, where data is an array of deleted rows
  if (count) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([image_path]);
    if (storageError) throw storageError;
  }};
