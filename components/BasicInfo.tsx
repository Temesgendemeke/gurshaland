"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Users } from "lucide-react";
import { difficulties } from "@/constants/recipe";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import RecipeImageField from "./RecipeImageField";

type FormValues = z.infer<typeof formSchema>;

interface BasicInfoFieldsProps {
  form: UseFormReturn<FormValues>;
  categories: { id: number; name: string }[];
  image?: File | string;
  setImage: (image: File | string | undefined) => void;
}

export default function BasicInfoFields({
  form,
  categories,
  image,
  setImage,
}: BasicInfoFieldsProps) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-none space-y-6">
      <CardHeader className="p-0 pb-4 border-b border-border/60">
        <CardTitle className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Recipe Details
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          The core details, title, and cover photo of your dish.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-5">
        <div className="grid gap-5  grid-cols-1 lg:grid-cols-2">
          <RecipeImageField
            image={image}
            setImage={setImage}
            className="aspect-[4/3] lg:aspect-auto"
          />

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="recipe.title"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Recipe Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Traditional Injera"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(selectedName) => {
                        const selectedCat = categories.find(
                          (cat) => cat.name === selectedName,
                        );
                        if (selectedCat) {
                          form.setValue("category", {
                            id: selectedCat.id,
                            name: selectedCat.name,
                          });
                        }
                      }}
                      value={field.value?.name || ""}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipe.description"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your recipe, its origins, and what makes it special..."
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="recipe.prepTime"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Prep Time (min)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" className="h-11 pr-10" {...field} />
                    <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipe.cookTime"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Cook Time (min)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" className="h-11 pr-10" {...field} />
                    <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipe.servings"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="4"
                      min={1}
                      className="h-11 pr-10"
                      {...field}
                    />
                    <Users className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipe.difficulty"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {difficulties.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
