import {
  FormControl,
  FormDescription,
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
import { CircleAlert, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UtensilsCrossed } from "lucide-react";
import restaurantSchema from "@/schema/restaurent";
import { z } from "zod";
import CusinesForm from "./cusinesForm";

type FormValues = z.infer<typeof restaurantSchema>;

const BasicInforForm = ({ form }: { form: any }) => {
  return (
    <Card className="border-none  bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary mb-1">
          <Store className="h-5 w-5" />
          <span className="font-semibold uppercase tracking-wider text-xs">
            Basic Info
          </span>
        </div>
        <CardTitle>Restaurant Details</CardTitle>
        <CardDescription>
          The core identity of your establishment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-6 border-2 border-dashed border-border rounded-xl bg-muted/30 hover:bg-muted/40 transition-colors">
            <h3 className="text-sm font-semibold mb-4 text-foreground/80">Cover Image</h3>
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
                    { shouldDirty: true }
                  );
                } else {
                  form.setValue("image", undefined, { shouldDirty: true });
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
              <CircleAlert className="w-4 h-4" /> <span>Recommended size: 1200x600px</span>
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
                    className="min-h-[120px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {form.watch('cuisines').map((cuisine, index) => (
                               <FormField
                                 control={form.control}
                                 name={`cuisines.${index}`}
                                 render={({ field }) => (
                                   <FormItem>
                                     <FormLabel>Cuisine Type</FormLabel>
                                     <FormControl>
                                       <Input placeholder="e.g. Ethiopian, Italian, Fusion" className="h-11" {...field} />
                                     </FormControl>
                                     <FormMessage />
                                   </FormItem>
                                 )}
                               />
                             ))} */}

          {/* <div>
            {form.watch("cuisines")?.map((cuisine, index) => (
              <FormField
                control={form.control}
                name={`cuisines.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Ethiopian, Italian, Fusion"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div> */}
          <CusinesForm form={form} />

          {/* <FormField
            control={form.control}
            name="cuisines"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine Type</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UtensilsCrossed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Ethiopian, Italian, Fusion"
                      className="pl-10 h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Separate multiple cuisines with commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInforForm;
