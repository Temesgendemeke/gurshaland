import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statuses } from "@/constants/recipe";
import { Card } from "./ui/card";

export default function StatusField({ form }) {
  return (
    <Card className="p-6 bg-card/70 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Status</h2>
      <FormField
        control={form.control}
        name="recipe.status"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="border-border bg-background">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="absolute bg-background"
                >
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
}
