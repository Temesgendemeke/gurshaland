"use client";
import { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Resolver,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/utils/schema";
import Recipe from "@/utils/types/recipe";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BasicInfoFields from "./BasicInfo";
import StatusField from "./StatusField";
import CulturalNoteField from "./CulturalNoteField";
import TagsField from "./TagsField";
import InstructionsField from "./InstructionsField";
import IngredientsField from "./IngredientsField";
import {
  insertRecipe,
  uploadRecipeImage,
  updateRecipe,
} from "@/actions/Recipe/recipe";
import { deleteImage } from "@/actions/Recipe/image";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateUniqueSlug } from "@/utils/slugify";
import NutritionField from "./NutritionField";
import { uploadInstructionImage } from "@/actions/Recipe/instruction";
import { getCategories } from "@/actions/Recipe/category";
import useRecipe from "@/store/DashboardRecipe";
import { shouldUploadRecipeImage } from "@/utils/recipeSubmission";

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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const router = useRouter();
  const updateRecipeInStore = useRecipe((store) => store.updateRecipeInStore);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategories(await getCategories());
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
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
        image: (recipe?.image || {
          path: "",
          url: "",
          recipe_id: recipe?.id?.toString() || "",
        }) as any,
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
              unit: ing.unit ?? undefined,
              notes: ing.notes ?? undefined,
              amount: ing.amount ?? undefined,
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
              time: ins.time ?? undefined,
              tips: ins.tips ?? undefined,
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
  const [recipeImage, setRecipeImage] = useState<File | string | undefined>(
    recipe?.image?.url ?? undefined,
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
      data.recipe.author_id = user.id;
      data.recipe.slug = await generateUniqueSlug(data.recipe.title, "recipe");
      const recipe_data = await insertRecipe(data as any);
      if (shouldUploadRecipeImage(recipeImage)) {
        await uploadRecipeImage(recipeImage, user.id, recipe_data.recipe.id);
      }

      for (const ins of instructionImages) {
        const instruction = recipe_data.instructions.find(
          (i: any) => i.step === ins.step,
        );
        if (instruction) {
          await uploadInstructionImage(ins.image, user.id, instruction.id);
        }
      }

      toast.success(
        "Recipe submitted successfully. Ethiopia thanks you for preserving our culinary heritage.",
      );
      router.push("/");
    } catch (error) {
      console.error(error);
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
      const titleChanged = data.recipe.title !== recipe.title;
      let newSlug = data.recipe.slug;

      if (titleChanged) {
        newSlug = await generateUniqueSlug(data.recipe.title, "recipe");
      }

      const recipeData = {
        ...data.recipe,
        id: typeof recipe.id === "string" ? parseInt(recipe.id) : recipe.id,
        slug: newSlug,
        preptime: data.recipe.prepTime,
        cooktime: data.recipe.cookTime,
        cultural_notes: data.recipe.culturalNote,
        tags: data.recipe.tags,
      };

      let recipeImageData = data.recipe.image;
      if (shouldUploadRecipeImage(recipeImage)) {
        if (recipe?.image?.path) {
          try {
            await deleteImage(recipe.image.path);
          } catch (error) {
            console.warn("Failed to delete old recipe image:", error);
          }
        }

        const uploadedImage: any = await uploadRecipeImage(
          recipeImage,
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

      const preparedInstructions = (await Promise.all(
        data.instructions.map(async (instruction, index) => {
          const instructionImage = instruction.image;
          let imageData: any = instructionImage;

          const newImageEntry = instructionImages.find(
            (img) => img.step === instruction.step,
          );

          if (newImageEntry && newImageEntry.image instanceof File) {
            const oldInstruction = recipe?.instructions?.find(
              (ins: any) => ins.step === instruction.step,
            );

            if (oldInstruction?.image?.path) {
              try {
                await deleteImage(oldInstruction.image.path);
              } catch (error) {
                console.warn(
                  `Failed to delete old instruction image for step ${instruction.step}:`,
                  error,
                );
              }
            }

            imageData = {
              url: "",
              path: "",
              instruction_id: undefined,
            };
          } else if (instructionImage && instructionImage.url) {
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
            id: instruction.id || 0,
            step: index + 1,
            time: instruction.time ? String(instruction.time) : undefined,
            image: imageData,
          };
        }),
      )) as any;

      const updatedRecipeData = await updateRecipe({
        recipe: recipeData,
        ingredients: data.ingredients,
        instructions: preparedInstructions as any,
        nutrition: data.nutrition,
      });

      if (instructionImages.length > 0) {
        await Promise.all(
          instructionImages.map(async (insImg) => {
            if (insImg.image instanceof File) {
              const updatedInstruction = updatedRecipeData.instructions?.find(
                (i: any) => i.step === insImg.step,
              );

              if (updatedInstruction?.id) {
                try {
                  await uploadInstructionImage(
                    insImg.image,
                    user.id,
                    updatedInstruction.id.toString(),
                  );
                } catch (error) {
                  console.error(
                    `Failed to upload instruction image for step ${insImg.step}:`,
                    error,
                  );
                }
              }
            }
          }),
        );
      }

      updateRecipeInStore(updatedRecipeData);

      toast.success("Recipe updated successfully. Your changes have been saved.");

      router.push(`/recipes/${newSlug}`);
    } catch (error) {
      console.error("Failed to update recipe:", error);
      toast.error("Failed to update recipe. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
      toast.error("User not authenticated. Please log in and try again.");
      return;
    }

    if (mode === "create") {
      await SaveRecipe(data);
    } else {
      await updateRecipeHandler(data);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <BasicInfoFields
          form={form}
          categories={categories}
          image={recipeImage}
          setImage={setRecipeImage}
        />
        <IngredientsField
          form={form}
          ingredientFields={ingredientFields}
          appendIngredient={appendIngredient}
          removeIngredient={removeIngredient}
        />
        <InstructionsField
          form={form}
          instructionFields={instructionFields}
          appendInstruction={appendInstruction}
          removeInstruction={removeInstruction}
        />

        <Card>
          <CardHeader>
            <CardTitle>Final touches</CardTitle>
            <CardDescription>
              Details that help people find and trust your recipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/70">
              <div className="pb-6">
                <NutritionField form={form} />
              </div>
              <div className="py-6">
                <TagsField
                  tags={form.watch("recipe.tags")}
                  newTag={newTag}
                  setNewTag={setNewTag}
                  addTag={addTag}
                  removeTag={removeTag}
                />
              </div>
              <div className="py-6">
                <CulturalNoteField form={form} />
              </div>
              <div className="pt-6">
                <StatusField form={form} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full active:scale-[0.98] sm:w-auto"
            disabled={form.formState.isSubmitting}
            aria-disabled={form.formState.isSubmitting}
          >
            {mode === "create"
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
  );
}
