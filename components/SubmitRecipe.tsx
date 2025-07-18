"use client";
import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  insertRecipe,
  uploadRecipeImage,
} from "@/actions/Recipe/recipe";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateUniqueSlug } from "@/utils/slugify";
import NutritionField from "./NutritionField";
import { uploadInstructionImage } from "@/actions/Recipe/instruction";
type FormValues = z.infer<typeof formSchema>;

interface SubmitRecipeFormProps {
  recipe?: Recipe;
}

export default function SubmitRecipeForm({ recipe }: SubmitRecipeFormProps) {
  const [newTag, setNewTag] = useState("");
  const clickRef = useRef(false);
  const isEditMode = !!recipe;
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipe: {
        author_id: recipe?.author_id || "",
        title: recipe?.title || "",
        category: recipe?.category || "",
        description: recipe?.description || "",
        prepTime: recipe?.preptime || 0,
        cookTime: recipe?.cooktime || 0,
        servings: recipe?.servings || 1,
        difficulty: recipe?.difficulty || "",
        tags: recipe?.tags || [],
        culturalNote: recipe?.culturalNote || "",
        image: recipe?.image || { path: "", url: "", recipe_id: "" },
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
      ingredients: recipe?.ingredients?.length
        ? recipe.ingredients
        : [{ item: "", amount: "", notes: "" }],
      instructions: recipe?.instructions?.length
        ? recipe.instructions
        : [
            {
              step: 1,
              title: "",
              description: "",
              time: "",
              tips: "",
              image: { path: "", url: "", instruction_id: "" },
            },
          ],
    },
  });
  const user = useAuth((store) => store.user);
  const [recipeImage, setRecipeImage] = useState<File>();
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

  const tags = form.watch("recipe.tags");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      form.setValue("recipe.tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "recipe.tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: FormValues) => {
    console.log(user);
    if (!user) {
      toast.error("User not authenticated. Please log in and try again.");
      return;
    }

    console.log("working..........");
    try {
      data.recipe.author_id = user?.id ?? "";

      data.recipe.slug = await generateUniqueSlug(data.recipe.title, "recipe");
      const recipe_data = await insertRecipe(data);
      console.log("from recipe dataq ", recipe_data);
      console.log("from images ", instructionImages);
      console.log("slug  ", data.recipe.slug);
      await uploadRecipeImage(
        recipeImage as File,
        user.id,
        recipe_data.recipe.id
      );

      instructionImages.forEach(async (ins) => {
        console.log(
          "Uploading instruction image for step:",
          ins.step,
          ins.image
        );
        const instruction = recipe_data.instructions.find(
          (i: any) => i.step === ins.step
        );
        console.log("instruction id ", instruction.id);
        if (instruction) {
          await uploadInstructionImage(ins.image, user?.id, instruction.id);
        }
      });

      toast.success(
        "Recipe submitted successfully! Ethiopia thanks you for preserving our culinary heritage! 🇪🇹"
      );
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit recipe. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className=" mx-auto px-6 py-12">
        <BackNavigation route="/recipes" pagename="Recipes" />
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold mb-4">
            <span className="">
              Share Your Recipe
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Help preserve Ethiopian culinary traditions by sharing your family
            recipes
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <BasicInfoFields form={form} recipe={recipe} />
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
              appendInstruction={appendInstruction}
              removeInstruction={removeInstruction}
              images={instructionImages}
              setImage={setinstructionImage}
            />
            <NutritionField form={form} />
            <TagsField
              tags={tags}
              newTag={newTag}
              setNewTag={setNewTag}
              addTag={addTag}
              removeTag={removeTag}
            />
            <CulturalNoteField form={form} />
            <StatusField form={form} />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="submit"
                size="lg"
                className="btn-primary-modern rounded-full"
              >
                Publish Recipe
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
    </div>
  );
}
