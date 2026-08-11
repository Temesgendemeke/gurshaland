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

  // delete from db and storage
  const deleteImage = async (path: string) => {};

  return (
    <Card className="border-border/60 bg-card shadow-[0_15px_40px_-30px_hsl(var(--foreground)/0.15)]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <PhotoIcon className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Gallery
            </span>
          </div>
          <CardTitle className="mt-1 font-gosh text-xl">Gallery</CardTitle>
          <CardDescription>
            Showcase the atmosphere — add up to a few photos of your space.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant={"outline"}
          onClick={() => appendGallery({})}
          className="shrink-0 gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Image
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {galleryFields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <PhotoIcon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground">
              No gallery images yet — add photos of the dining room, terrace,
              or signature dishes.
            </p>
          </div>
        ) : (
          galleryFields.map((gallery, index) => (
            <div key={gallery.id} className="relative">
              <ImageBox
                form={form}
                inputcls={`gallery-image-${index}`}
                field={`gallery.${index}` as any}
                label={`Gallery ${index + 1}`}
                deleteImage={deleteImage}
              />
              <Button
                type="button"
                onClick={() => removeGallery(index)}
                className="absolute top-6 right-6 z-10"
                variant={"outline"}
              >
                <Trash className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default GalleryForm;
