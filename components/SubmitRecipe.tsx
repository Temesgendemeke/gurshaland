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
import { Loader2 } from "lucide-react";
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
import { deleteImage, uploadImage } from "@/actions/Recipe/image";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateUniqueSlug } from "@/utils/slugify";
import NutritionField from "./NutritionField";
import { uploadInstructionImage } from "@/actions/Recipe/instruction";
import { getCategories } from "@/actions/Recipe/category";
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCats = await getCategories();
        setCategories(fetchedCats || []);

        const currentCat = form.getValues("category");
        if ((!currentCat || !currentCat.name) && recipe) {
          const catId = (recipe as any)?.category_id || recipe?.category?.id;
          if (catId) {
            const match = fetchedCats?.find((c: any) => c.id === catId);
            if (match) {
              form.setValue("category", { id: match.id, name: match.name });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [recipe]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      recipe: {
        author_id: recipe?.author_id || "",
        title: recipe?.title || "",
        description: recipe?.description || "",
        prepTime: recipe?.preptime ?? 0,
        cookTime: recipe?.cooktime ?? 0,
        servings: recipe?.servings ?? 1,
        difficulty: recipe?.difficulty || "",
        tags: recipe?.tags || [],
        culturalNote:
          recipe?.culturalNote || (recipe as any)?.cultural_notes || "",
        image:
          recipe?.image && recipe.image.url
            ? {
                path: recipe.image.path || "",
                url: recipe.image.url,
                recipe_id: recipe.id ? Number(recipe.id) : undefined,
              }
            : undefined,
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
      category:
        recipe?.category && recipe.category.name
          ? { id: recipe.category.id, name: recipe.category.name }
          : undefined,
      ingredients: recipe?.ingredients?.length
        ? recipe.ingredients
            .filter((ing: any) => ing !== null && ing !== undefined)
            .map((ing: any) => ({
              id: ing.id,
              item: ing.item || "",
              unit: ing.unit ?? "",
              notes: ing.notes ?? "",
              amount:
                ing.amount !== null && ing.amount !== undefined
                  ? ing.amount
                  : "",
            }))
        : [{ item: "", amount: "", notes: "" }],
      instructions: recipe?.instructions?.length
        ? recipe.instructions
            .filter((ins: any) => ins !== null && ins !== undefined)
            .map((ins: any) => ({
              id: ins.id || 0,
              title: ins.title || "",
              description: ins.description || "",
              step: ins.step || 1,
              time:
                ins.time !== null && ins.time !== undefined && ins.time !== ""
                  ? Number(ins.time)
                  : "",
              tips: ins.tips ?? "",
              image:
                ins.image && ins.image.url
                  ? {
                      url: ins.image.url,
                      path: ins.image.path || "",
                      instruction_id: ins.id ? Number(ins.id) : undefined,
                    }
                  : undefined,
            }))
        : [
            {
              step: 1,
              title: "",
              description: "",
              time: "",
              tips: "",
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
      (data.recipe as any).preptime = data.recipe.prepTime ?? 0;
      (data.recipe as any).cooktime = data.recipe.cookTime ?? 0;
      (data.recipe as any).totaltime =
        (data.recipe.prepTime ?? 0) + (data.recipe.cookTime ?? 0);
      (data.recipe as any).cultural_notes = data.recipe.culturalNote || "";
      (data.recipe as any).category_id = data.category?.id || null;

      const recipe_data = await insertRecipe(data as any);
      if (shouldUploadRecipeImage(recipeImage) && recipe_data?.recipe?.id) {
        await uploadRecipeImage(
          recipeImage as File,
          user.id,
          recipe_data.recipe.id.toString(),
        );
      }

      if (recipe_data?.instructions) {
        for (const ins of data.instructions) {
          const imgObj = ins.image as any;
          if (imgObj?.file instanceof File) {
            const matchedInstruction = recipe_data.instructions.find(
              (i: any) => i.step === ins.step,
            );
            if (matchedInstruction?.id) {
              await uploadInstructionImage(
                imgObj.file,
                user.id,
                matchedInstruction.id.toString(),
              );
            }
          }
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
      toast.error("User ID is required. Please log in.");
      return;
    }

    if (!recipe?.id) {
      toast.error("Recipe ID is missing. Cannot update.");
      return;
    }

    try {
      const titleChanged = data.recipe.title !== recipe.title;
      let newSlug = data.recipe.slug || recipe.slug;

      if (titleChanged) {
        newSlug = await generateUniqueSlug(data.recipe.title, "recipe");
      }

      let recipeImageData: any = data.recipe.image;
      if (shouldUploadRecipeImage(recipeImage)) {
        if (recipe?.image?.path) {
          try {
            await deleteImage(recipe.image.path);
          } catch (error) {
            console.warn("Failed to delete old recipe image:", error);
          }
        }

        const uploadedImage = await uploadImage(
          recipeImage as File,
          user.id,
        );

        if (uploadedImage && uploadedImage.url) {
          recipeImageData = {
            path: uploadedImage.path,
            url: uploadedImage.url,
            recipe_id: recipe.id ? Number(recipe.id) : undefined,
          };
        }
      } else if (recipe?.image && recipe.image.url) {
        recipeImageData = {
          path: recipe.image.path || "",
          url: recipe.image.url,
          recipe_id: recipe.id ? Number(recipe.id) : undefined,
        };
      }

      const preparedInstructions = await Promise.all(
        data.instructions.map(async (instruction, index) => {
          const imgObj = instruction.image as any;
          let finalImage = undefined;

          if (imgObj?.file instanceof File) {
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

            const uploaded = await uploadImage(imgObj.file, user.id);
            finalImage = {
              url: uploaded.url,
              path: uploaded.path,
            };
          } else if (imgObj && imgObj.url && imgObj.url !== "") {
            finalImage = {
              url: imgObj.url,
              path: imgObj.path || "",
            };
          }

          return {
            ...instruction,
            id: instruction.id || undefined,
            step: index + 1,
            time: instruction.time ? String(instruction.time) : undefined,
            image: finalImage,
          };
        }),
      );

      const recipeData = {
        ...data.recipe,
        id: typeof recipe.id === "string" ? parseInt(recipe.id) : recipe.id,
        author_id: user.id || recipe.author_id,
        category_id:
          data.category?.id ||
          (recipe as any)?.category_id ||
          (recipe as any)?.category?.id ||
          null,
        slug: newSlug,
        preptime: data.recipe.prepTime ?? 0,
        cooktime: data.recipe.cookTime ?? 0,
        totaltime: (data.recipe.prepTime ?? 0) + (data.recipe.cookTime ?? 0),
        cultural_notes: data.recipe.culturalNote || "",
        tags: data.recipe.tags || [],
        image: recipeImageData,
      };

      await updateRecipe({
        recipe: recipeData,
        ingredients: data.ingredients,
        instructions: preparedInstructions as any,
        nutrition: data.nutrition,
      });

      toast.success(
        "Recipe updated successfully. Your changes have been saved.",
      );

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
      <form
        className="space-y-8  mx-auto pb-12"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          const firstKey = Object.keys(errors)[0];
          const err = errors[firstKey as keyof typeof errors] as any;
          const msg =
            err?.message ||
            err?.title?.message ||
            err?.item?.message ||
            `Please check field: ${firstKey}`;
          toast.error(msg);
        })}
      >
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

        <Card className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-none space-y-6">
          <CardHeader className="p-0 pb-4 border-b border-border/60">
            <CardTitle className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Nutrition Information
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Estimated per serving values that help people find and trust your recipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <NutritionField form={form} />
          </CardContent>
        </Card>

        <TagsField
          tags={form.watch("recipe.tags")}
          newTag={newTag}
          setNewTag={setNewTag}
          addTag={addTag}
          removeTag={removeTag}
        />
        <CulturalNoteField form={form} />
        <StatusField form={form} />

        {/* Sticky Action Footer */}
        <div className="sticky bottom-6 z-20 flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/95 p-4 backdrop-blur-md shadow-none sm:p-5 mx-1">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {mode === "create"
              ? "Ready to share with the Gurshaland community?"
              : "Review and save your changes to this recipe."}
          </div>
          <div className="flex items-center gap-3  w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-10 rounded-xl px-4 sm:px-5 text-xs sm:text-sm font-medium border-border/80"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="h-10 rounded-xl px-6 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>{mode === "create" ? "Publishing…" : "Updating…"}</span>
                </>
              ) : (
                <span>{mode === "create" ? "Publish Recipe" : "Update Recipe"}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
