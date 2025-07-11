import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Textarea } from "./ui/textarea";



export default function CulturalNoteField({ form }) {
  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Cultural Significance (Optional)
      </h2>
      <FormField
        control={form.control}
        name="recipe.culturalNote"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Share the cultural background, family history, or traditional significance of this recipe..."
                rows={4}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Card>
  );
}
