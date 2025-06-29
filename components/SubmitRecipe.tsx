"use client";

import { useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload, Clock, Users } from "lucide-react";
import {
  ingredientSchema,
  instructionSchema,
  formSchema,
} from "@/utils/schema";
import Recipe from "@/utils/types/recipe";
import BackNavigation from "./BackNavigation";
import { FormField } from "./ui/form";

type FormValues = z.infer<typeof formSchema>;

interface SubmitRecipeFormProps {
  recipe?: Recipe;
}

export default function SubmitRecipeForm({ recipe }: SubmitRecipeFormProps) {
  const [image, setImage] = useState<File>();
  const [newTag, setNewTag] = useState("");
  const clickRef = useRef(false);
  const isEditMode = !!recipe;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
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
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control, name: "instructions" });

  const tags = watch("tags");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
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

    if (isEditMode) {
      return;
    }

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

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="title"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Recipe Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Traditional Injera"
                  {...register("title")}
                  className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div>
                <Label
                  htmlFor="category"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Category *
                </Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="dark:border-emerald-700 bg-white dark:bg-gray-900">
                        <SelectItem value="bread">Bread</SelectItem>
                        <SelectItem value="meat">Meat Dishes</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                        <SelectItem value="spices">Spices & Sauces</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <span className="text-red-500 text-xs">
                    {errors.category.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your recipe, its origins, and what makes it special..."
                {...register("description")}
                className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                rows={4}
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div>
                <Label
                  htmlFor="prepTime"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Prep Time
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="prepTime"
                    placeholder="30 min"
                    {...register("prepTime")}
                    className="pl-10 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="cookTime"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Cook Time
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="cookTime"
                    placeholder="1 hour"
                    {...register("cookTime")}
                    className="pl-10 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="servings"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Servings
                </Label>
                <div className="relative mt-2">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="servings"
                    placeholder="4"
                    {...register("servings")}
                    className="pl-10 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="difficulty"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Difficulty
                </Label>
                <Controller
                  control={control}
                  name="difficulty"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Recipe Image
            </h2>
            <div
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer"
              onClick={() =>
                document.getElementById("recipe-image-input")?.click()
              }
            >
              {image ? (
                <div className="flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Recipe Preview"
                    className="max-h-48 rounded-lg mb-2 object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(undefined);
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}
              <input
                id="recipe-image-input"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImage(file);
                }}
              />
              {!image && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
                  onClick={handleImage}
                >
                  Choose File
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Ingredients
              </h2>
              <Button
                onClick={() =>
                  appendIngredient({ item: "", amount: "", notes: "" })
                }
                type="button"
                variant="outline"
                size="sm"
                className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
            <div className="space-y-4">
              {ingredientFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid md:grid-cols-12 gap-4 items-start"
                >
                  <div className="md:col-span-3">
                    <Input
                      placeholder="Amount (e.g., 2 cups)"
                      {...register(`ingredients.${index}.amount`)}
                      className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                    />
                    {errors.ingredients?.[index]?.amount && (
                      <span className="text-red-500 text-xs">
                        {errors.ingredients[index]?.amount?.message}
                      </span>
                    )}
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Ingredient name"
                      {...register(`ingredients.${index}.item`)}
                      className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                    />
                    {errors.ingredients?.[index]?.item && (
                      <span className="text-red-500 text-xs">
                        {errors.ingredients[index]?.item?.message}
                      </span>
                    )}
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Notes (optional)"
                      {...register(`ingredients.${index}.notes`)}
                      className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div className="md:col-span-1">
                    {ingredientFields.length > 1 && (
                      <Button
                        onClick={() => removeIngredient(index)}
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Instructions
              </h2>
              <Button
                type="button"
                onClick={() =>
                  appendInstruction({
                    title: "",
                    description: "",
                    time: "",
                    tips: "",
                  })
                }
                variant="outline"
                size="sm"
                className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
            <div className="space-y-6">
              {instructionFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Step {index + 1}
                    </span>
                    {instructionFields.length > 1 && (
                      <Button
                        onClick={() => removeInstruction(index)}
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Step Title
                      </Label>
                      <Input
                        placeholder="e.g., Prepare the batter"
                        {...register(`instructions.${index}.title`)}
                        className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      />
                      {errors.instructions?.[index]?.title && (
                        <span className="text-red-500 text-xs">
                          {errors.instructions[index]?.title?.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">
                        Time Required
                      </Label>
                      <Input
                        placeholder="e.g., 15 min"
                        {...register(`instructions.${index}.time`)}
                        className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Instructions
                    </Label>
                    <Textarea
                      placeholder="Describe this step in detail..."
                      {...register(`instructions.${index}.description`)}
                      className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      rows={3}
                    />
                    {errors.instructions?.[index]?.description && (
                      <span className="text-red-500 text-xs">
                        {errors.instructions[index]?.description?.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">
                      Tips (Optional)
                    </Label>
                    <Textarea
                      placeholder="Any helpful tips for this step..."
                      {...register(`instructions.${index}.tips`)}
                      className="mt-2 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-2 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., Traditional, Spicy, Vegan)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
              />
              <Button
                onClick={addTag}
                type="button"
                variant="outline"
                className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                Add
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Cultural Significance (Optional)
            </h2>
            <Textarea
              placeholder="Share the cultural background, family history, or traditional significance of this recipe..."
              {...register("culturalNote")}
              className="border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
              rows={4}
            />
          </Card>

          <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Status
            </h2>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@example.com">
                        m@example.com
                      </SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">
                        m@support.com
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can manage email addresses in your{" "}
                    <Link href="/examples/forms">email settings</Link>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

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
      </div>
      <Footer />
    </div>
  );
}
