"use client";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImageToFile } from "@/utils/compressImage";

interface RecipeImageFieldProps {
  image?: File | string;
  setImage: (image: File | string | undefined) => void;
  className?: string;
}

export default function RecipeImageField({
  image,
  setImage,
  className,
}: RecipeImageFieldProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full  cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/70 p-5 text-center transition-colors hover:border-primary/50",
        className,
      )}
      onClick={() => document.getElementById("recipe-image-input")?.click()}
    >
      {image ? (
        <div className="flex w-full flex-col items-center">
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt="Recipe Preview"
            className="mb-4 aspect-[4/3] w-full rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-error hover:text-error/80"
            onClick={(e) => {
              e.stopPropagation();
              setImage(undefined);
            }}
          >
            <X className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>
      ) : (
        <>
          <Upload className="mb-3 h-10 w-10 text-primary" />
          <p className="font-medium text-foreground">Click to upload</p>
          <p className="mt-1 text-sm text-muted-foreground">
            PNG, JPG, or WebP (auto-optimized)
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 border-primary/40 text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("recipe-image-input")?.click();
            }}
          >
            Choose File
          </Button>
        </>
      )}
      <input
        id="recipe-image-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const optimized = await compressImageToFile(file, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.82,
            mimeType: "image/webp",
          });
          setImage(optimized);
        }}
      />
    </div>
  );
}
