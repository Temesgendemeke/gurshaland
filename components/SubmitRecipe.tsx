"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/utils/schema";
import Recipe, { RecipeImage } from "@/utils/types/recipe";
import BackNavigation from "./BackNavigation";
import { Form } from "@/components/ui/form";
import BasicInfoFields from "./BasicInfo";
import StatusField from "./StatusField";
import CulturalNoteField from "./CulturalNoteField";
import TagsField from "./TagsField";
import InstructionsField from "./InstructionsField";
import IngredientsField from "./IngredientsField";
import RecipeImageField from "./RecipeImageField";
import { insertRecipe, uploadRecipeImage, updateRecipe, getRecipebySlug } from "@/actions/Recipe/recipe";
import { deleteImage } from "@/actions/Recipe/image";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateUniqueSlug } from "@/utils/slugify";
import NutritionField from "./NutritionField";
import { uploadInstructionImage } from "@/actions/Recipe/instruction";
import { getCategories } from "@/actions/Recipe/category";
import useRecipe from "@/store/DashboardRecipe";
type FormValues = z.infer<typeof formSchema>;

interface SubmitRecipeFormProps {
  recipe?: Recipe;
  mode?: "create" | "update";
}

export default function SubmitRecipeForm({
  recipe,
  mode = "create",
}: SubmitRecipeFormProps) {
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [oldRecipe, setOldRecipe] = useState<Recipe | null>(recipe || null);
  const updateRecipeInStore = useRecipe(store => store.updateRecipeInStore)
  // Fetch categories on component mount

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipe: {
        author_id: recipe?.author_id || "",
        title: recipe?.title || "",
        description: recipe?.description || "",
        prepTime: recipe?.preptime || 0,
        cookTime: recipe?.cooktime || 0,
        servings: recipe?.servings || 1,
        difficulty: recipe?.difficulty || "",
        tags: recipe?.tags || [],
        culturalNote: recipe?.culturalNote || "",
        image: (recipe?.image || { path: "", url: "", recipe_id: recipe?.id?.toString() || "" }) as any,
        status: recipe?.status || "draft",
        slug: recipe?.slug || "",
      },
      nutrition: recipe?.nutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      category: recipe?.category || { id: 0, name: "" },
      ingredients: recipe?.ingredients?.length
        ? recipe.ingredients
            .filter((ing: any) => ing !== null && ing !== undefined)
            .map((ing: any) => ({
              id: ing.id,
              item: ing.item || "",
              unit: ing.unit !== null && ing.unit !== undefined ? ing.unit : undefined,
              notes: ing.notes !== null && ing.notes !== undefined ? ing.notes : undefined,
              amount: ing.amount !== null && ing.amount !== undefined ? ing.amount : undefined,
            }))
        : [{ item: "", amount: 0, notes: "" }],
      instructions: recipe?.instructions?.length
        ? recipe.instructions
            .filter((ins: any) => ins !== null && ins !== undefined)
            .map((ins: any) => ({
              id: ins.id || 0,
              title: ins.title || "",
              description: ins.description || "",
              step: ins.step || 1,
              time: ins.time !== null && ins.time !== undefined ? ins.time : undefined,
              tips: ins.tips !== null && ins.tips !== undefined ? ins.tips : undefined,
              image: ins.image && ins.image !== null ? ins.image : undefined,
            }))
        : [
            {
              step: 1,
              title: "",
              description: "",
              time: 0,
              tips: undefined,
              image: undefined,
            },
          ],
    },
  });
  const user = useAuth((store) => store.user);
  const [recipeImage, setRecipeImage] = useState<File | string>(
    recipe?.image.url ?? "",
  );
  const [instructionImages, setinstructionImage] = useState<
    { step: number; image: File }[]
  >([]);

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control: form.control, name: "ingredients" });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control: form.control, name: "instructions" });

  const addTag = () => {
    if (newTag.trim() && !form.watch("recipe.tags").includes(newTag.trim())) {
      form.setValue("recipe.tags", [
        ...form.watch("recipe.tags"),
        newTag.trim(),
      ]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "recipe.tags",
      form.watch("recipe.tags").filter((tag) => tag !== tagToRemove),
    );
  };

  const SaveRecipe = async (data: FormValues) => {
    if (!user?.id) {
      console.error("User ID is required");
      return;
    }

    try {
      data.recipe.author_id = user?.id as string;

      data.recipe.slug = await generateUniqueSlug(data.recipe.title, "recipe");
      const recipe_data = await insertRecipe(data as any);
      console.log("from recipe data ", recipe_data);
      console.log("from images ", instructionImages);
      console.log("slug  ", data.recipe.slug);
      await uploadRecipeImage(
        recipeImage as File,
        user.id,
        recipe_data.recipe.id,
      );

      instructionImages.forEach(async (ins) => {
        console.log(
          "Uploading instruction image for step:",
          ins.step,
          ins.image,
        );
        const instruction = recipe_data.instructions.find(
          (i: any) => i.step === ins.step,
        );
        console.log("instruction id ", instruction.id);
        if (instruction) {
          await uploadInstructionImage(ins.image, user?.id, instruction.id);
        }
      });

      toast.success(
        "Recipe submitted successfully! Ethiopia thanks you for preserving our culinary heritage! 🇪🇹",
      );
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit recipe. Please try again.");
    }
  };

  const updateRecipeHandler = async (data: FormValues) => {
    if (!user?.id) {
      console.error("User ID is required");
      return;
    }

    if (!recipe?.id) {
      toast.error("Recipe ID is missing. Cannot update.");
      return;
    }

    try {
      // Update slug if title changed
      const titleChanged = data.recipe.title !== recipe.title;
      let newSlug = data.recipe.slug;
      
      if (titleChanged) {
        newSlug = await generateUniqueSlug(data.recipe.title, "recipe");
      }

      // Prepare recipe data for update
      const recipeData = {
        ...data.recipe,
        id: typeof recipe.id === 'string' ? parseInt(recipe.id) : recipe.id,
        slug: newSlug,
        preptime: data.recipe.prepTime,
        cooktime: data.recipe.cookTime,
        cultural_notes: data.recipe.culturalNote,
        tags: data.recipe.tags,
      };

      // Handle recipe image upload if it's a File
      let recipeImageData = data.recipe.image;
      if (recipeImage instanceof File) {
        // Delete old image if it exists
        if (recipe?.image?.path) {
          try {
            await deleteImage(recipe.image.path);
          } catch (error) {
            console.warn("Failed to delete old recipe image:", error);
          }
        }

        // Upload new image
        const uploadedImage: any = await uploadRecipeImage(
          recipeImage as File,
          user.id,
          recipe.id.toString(),
        );
        
        if (uploadedImage && uploadedImage[0]) {
          recipeImageData = {
            path: uploadedImage[0].path,
            url: uploadedImage[0].url,
            recipe_id: recipe.id.toString(),
          } as any;
        }
      }

      recipeData.image = recipeImageData;

      // Prepare instructions with proper image handling
      const preparedInstructions = await Promise.all(
        data.instructions.map(async (instruction, index) => {
          const instructionImage = instruction.image;
          let imageData: any = instructionImage;

          // Check if there's a new file to upload in instructionImages state
          const newImageEntry = instructionImages.find(
            (img) => img.step === instruction.step
          );

          if (newImageEntry && newImageEntry.image instanceof File) {
            // Delete old instruction image if it exists
            const oldInstruction = recipe?.instructions?.find(
              (ins: any) => ins.step === instruction.step
            );
            
            if (oldInstruction?.image?.path) {
              try {
                await deleteImage(oldInstruction.image.path);
              } catch (error) {
                console.warn(
                  `Failed to delete old instruction image for step ${instruction.step}:`,
                  error
                );
              }
            }

            // We'll upload instruction images after the update since we need the instruction IDs
            // For now, set empty image to be filled after upload
            imageData = {
              url: "",
              path: "",
              instruction_id: undefined,
            };
          } else if (instructionImage && instructionImage.url) {
            // Keep existing image
            imageData = {
              url: instructionImage.url,
              path: instructionImage.path || "",
              instruction_id: instructionImage.instruction_id,
            };
          } else {
            imageData = undefined;
          }

          return {
            ...instruction,
            id: instruction.id || 0, // Temporary ID, will be set by database
            step: index + 1,
            time: instruction.time ? String(instruction.time) : undefined, // Convert to string for database
            image: imageData,
          };
        })
      ) as any;

      // Call update RPC function
      const updatedRecipeData = await updateRecipe({
        recipe: recipeData,
        ingredients: data.ingredients,
        instructions: preparedInstructions as any,
        nutrition: data.nutrition,
      });

      // Upload new instruction images after update
      if (instructionImages.length > 0) {
        await Promise.all(
          instructionImages.map(async (insImg) => {
            if (insImg.image instanceof File) {
              const updatedInstruction = updatedRecipeData.instructions?.find(
                (i: any) => i.step === insImg.step
              );
              
              if (updatedInstruction?.id) {
                try {
                  await uploadInstructionImage(
                    insImg.image,
                    user.id,
                    updatedInstruction.id.toString()
                  );
                } catch (error) {
                  console.error(
                    `Failed to upload instruction image for step ${insImg.step}:`,
                    error
                  );
                }
              }
            }
          })
        );
      }

      updateRecipeInStore(updatedRecipeData)

      toast.success(
        "Recipe updated successfully! Your Ethiopian culinary masterpiece has been refined! 🇪🇹"
      );
      
      // Navigate to the updated recipe (use new slug if changed)
      router.push(`/recipes/${newSlug}`);
    } catch (error) {
      console.error("Failed to update recipe:", error);
      toast.error("Failed to update recipe. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(user);
    if (!user) {
      toast.error("User not authenticated. Please log in and try again.");
      return;
    }

    if (mode == "create") {
      await SaveRecipe(data);
    } else if (mode == "update") {
      await updateRecipeHandler(data);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-8"
          onSubmit={form.handleSubmit(onSubmit as any)}
        >
          <p>{mode}</p>
          {JSON.stringify(form.formState.errors)}
          <BasicInfoFields
            form={form}
            recipe={recipe}
            categories={categories}
          />
          <RecipeImageField image={recipeImage} setImage={setRecipeImage} />
          <IngredientsField
            form={form}
            ingredientFields={ingredientFields}
            appendIngredient={appendIngredient}
            removeIngredient={removeIngredient}
          />
          <InstructionsField
            form={form}
            instructionFields={instructionFields}
            appendInstruction={appendInstruction as any}
            removeInstruction={removeInstruction}
          />
          <NutritionField form={form} />
          <TagsField
            tags={form.watch("recipe.tags")}
            newTag={newTag}
            setNewTag={setNewTag}
            addTag={addTag}
            removeTag={removeTag}
          />
          <CulturalNoteField form={form} />
          <StatusField form={form} />
          <div className={`flex flex-col sm:flex-row gap-4 justify-center`}>
            <Button
              type="submit"
              size="lg"
              className="btn-primary-modern rounded-full"
              disabled={form.formState.isSubmitting}
              aria-disabled={form.formState.isSubmitting}
            >
              {mode == "create"
                ? form.formState.isSubmitting
                  ? "Publishing..."
                  : "Publish Recipe"
                : form.formState.isSubmitting
                  ? "Updating..."
                  : "Update Recipe"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
