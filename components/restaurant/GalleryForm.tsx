"use client";
import { RestaurantFormType } from "@/schema/restaurent";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconPlus as Plus, IconTrash as Trash, IconPhoto as PhotoIcon } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import ImageBox from "@/components/ImageBox";
import { useFieldArray } from "react-hook-form";

const GalleryForm = ({
  form,
}: {
  form: UseFormReturn<RestaurantFormType>;
}) => {
  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
  } = useFieldArray({
    control: form.control,
    name: "gallery",
  });

  const deleteImage = async (_path: string) => {};

  return (
    <Card className="border border-border bg-card/60 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 sm:p-6 pb-3 sm:pb-4">
        <div>
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
            Photo Gallery
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Showcase dining areas, ambiance, outdoor patio, or signature presentations.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendGallery({})}
          className="shrink-0 gap-1.5 h-8 font-medium text-xs sm:text-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Photo</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
        {galleryFields.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-8 text-center">
            <PhotoIcon className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium text-foreground">No gallery photos yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Add photos of your establishment to enhance diner trust and engagement.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendGallery({})}
              className="mt-4 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {galleryFields.map((gallery, index) => (
              <div key={gallery.id} className="relative rounded-lg border border-border p-4 bg-muted/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Photo #{index + 1}
                  </span>
                  <Button
                    type="button"
                    onClick={() => removeGallery(index)}
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <ImageBox
                  form={form}
                  inputcls={`gallery-image-${index}`}
                  field={`gallery.${index}` as any}
                  label={`Gallery ${index + 1}`}
                  deleteImage={deleteImage}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GalleryForm;
