import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pattern as FileUpload } from "@/components/FileUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import restaurantSchema from "@/schema/restaurent";
import { z } from "zod";
import CusinesForm from "./cusinesForm";
import { normalizeImageUrl } from "@/lib/utils";

type FormValues = z.infer<typeof restaurantSchema>;

const BasicInforForm = ({ form }: { form: any }) => {
  const rawImage = form.watch("image");
  const initialImageUrl = normalizeImageUrl(
    rawImage?.url ||
      (rawImage?.file instanceof File ? URL.createObjectURL(rawImage.file) : null) ||
      rawImage,
  );

  return (
    <Card className="border border-border bg-card/60 rounded-xl">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
          Basic Information
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          General establishment profile, hero cover photo, and culinary specialties.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
        {/* Cover Photo */}
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium">Cover Image</FormLabel>
          <div className="rounded-lg border border-border/80 bg-muted/10 p-3 sm:p-4">
            <FileUpload
              initialImage={initialImageUrl}
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
            <p className="mt-2 text-xs text-muted-foreground">
              Recommended aspect ratio 16:9 (e.g. 1920×1080px or 1200×675px). Max 10MB.
            </p>
          </div>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Gursha Traditional Restaurant"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short overview of your atmosphere, culinary traditions, and dining experience..."
                  className="min-h-[6.5rem] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief summary displayed on listings and search results.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cuisines */}
        <CusinesForm form={form} />
      </CardContent>
    </Card>
  );
};

export default BasicInforForm;
