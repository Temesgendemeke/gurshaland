export const shouldUploadRecipeImage = (image: File | string | undefined) => {
  return image instanceof File;
};
