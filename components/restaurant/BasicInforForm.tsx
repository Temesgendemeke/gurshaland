import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pattern as FileUpload } from "@/components/FileUpload";
import { IconAlertCircle as AlertCircle, IconBuildingStore as Store } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import restaurantSchema from "@/schema/restaurent";
import { z } from "zod";
import CusinesForm from "./cusinesForm";

type FormValues = z.infer<typeof restaurantSchema>;

const BasicInforForm = ({ form }: { form: any }) => {
  return (
    <Card className="border-border/60 bg-card shadow-[0_15px_40px_-30px_hsl(var(--foreground)/0.15)]">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <Store className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            Basic Info
          </span>
        </div>
        <CardTitle className="mt-1 font-gosh text-xl">
          Restaurant Details
        </CardTitle>
        <CardDescription>
          The core identity of your establishment — name, story, and cover.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-5">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground/80">
              Cover Image
            </h3>
            <FileUpload
              maxSize={10 * 1024 * 1024} // 10MB
              accept="image/*"
              onImageChange={(file) => {
                if (file) {
                  form.setValue(
                    "image",
                    {
                      url: URL.createObjectURL(file),
                      file,
                      path: "",
                    },
                    { shouldDirty: true },
                  );
                } else {
                  form.setValue("image", undefined, { shouldDirty: true });
                }
              }}
            />
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>Recommended size: 1200x600px</span>
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Gursha House"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your restaurant, atmosphere, and specialties..."
                    className="min-h-[7.5rem] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CusinesForm form={form} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInforForm;
