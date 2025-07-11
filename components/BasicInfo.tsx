import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/constants/recipe";
import { Textarea } from "./ui/textarea";
import { Clock, Users } from "lucide-react";
import { difficulties } from "@/constants/recipe";

export default function BasicInfoFields({ form, recipe }) {
  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Basic Information
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="recipe.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Traditional Injera" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipe.category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
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
      <FormField
        control={form.control}
        name="recipe.description"
        render={({ field }) => (
          <FormItem className="mt-6">
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your recipe, its origins, and what makes it special..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <FormField
          control={form.control}
          name="recipe.prepTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prep Time (min)</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input {...field} type="number" className="pr-10" />
                  <Clock className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
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
            <FormItem>
              <FormLabel>Cook Time (min)</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input {...field} className="pr-10" type="number" />
                  <Clock className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
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
            <FormItem>
              <FormLabel>Servings</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    placeholder="4"
                    {...field}
                    className="pr-10"
                    min={1}
                  />
                  <Users className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
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
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
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
    </Card>
  );
}
