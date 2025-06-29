"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/utils/schema";
import Recipe from "@/utils/types/recipe";
import BackNavigation from "./BackNavigation";
import {
  Form,
} from "@/components/ui/form";
import BasicInfoFields from "./BasicInfo";
import StatusField from "./StatusField";
import CulturalNoteField from "./CulturalNoteField";
import TagsField from "./TagsField";
import InstructionsField from "./InstructionsField";
import IngredientsField from "./IngredientsField";
import RecipeImageField from "./RecipeImageField";
 

type FormValues = z.infer<typeof formSchema>;

interface SubmitRecipeFormProps {
  recipe?: Recipe;
}

export default function SubmitRecipeForm({ recipe }: SubmitRecipeFormProps) {
  const [image, setImage] = useState<File>();
  const [newTag, setNewTag] = useState("");
  const clickRef = useRef(false);
  const isEditMode = !!recipe;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: recipe?.title ?? "",
      category: recipe?.category ?? "",
      description: recipe?.description ?? "",
      prepTime: recipe?.prepTime ?? "",
      cookTime: recipe?.cookTime ?? "",
      servings: recipe?.servings ?? "",
      difficulty: recipe?.difficulty ?? "",
      ingredients: recipe?.ingredients ?? [{ item: "", amount: "", notes: "" }],
      instructions: recipe?.instructions ?? [
        { title: "", description: "", time: "", tips: "" },
      ],
      tags: recipe?.tags ?? [],
      culturalNote: recipe?.culturalNote ?? "",
      image: recipe?.image ?? undefined,
      status: recipe?.status ?? "draft",
    },
  });

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

  const tags = form.watch("tags");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      form.setValue("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleImage = (e) => {
    e.preventDefault();
    if (!clickRef.current) {
      clickRef.current = true;
      document.getElementById("recipe-image-input")?.click();
      setTimeout(() => {
        clickRef.current = false;
      }, 300);
    }
  };

  const onSubmit = (data: FormValues) => {
    data.image = image;
    if (isEditMode) return;
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackNavigation route="/recipes" pagename="Recipes" />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
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
            <RecipeImageField image={image} setImage={setImage} handleImage={handleImage} />
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
                className="bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white px-8 py-4 text-lg rounded-full"
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
