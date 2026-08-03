"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import React from "react";

interface RecipeImageFieldProps {
  image?: File | string;
  setImage: (image: File | string | undefined) => void;
}

export default function RecipeImageField({
  image,
  setImage,
}: RecipeImageFieldProps) {
  const handleImage = (e) => {
    e.preventDefault();
    document.getElementById("recipe-image-input")?.click();
  };

  return (
    <Card className="p-6 bg-card/70 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Recipe Image</h2>
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/60 transition-colors cursor-pointer"
        onClick={() => document.getElementById("recipe-image-input")?.click()}
      >
        {image ? (
          <div className="flex flex-col items-center">
            <img
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt="Recipe Preview"
              className="max-h-48 rounded-lg mb-2 object-contain"
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
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground/80">
              PNG, JPG up to 10MB
            </p>
          </>
        )}
        <input
          id="recipe-image-input"
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setImage(file);
          }}
        />
        {!image && (
          <Button
            type="button"
            variant="outline"
            className="mt-4 border-primary/40 text-primary hover:bg-primary/10"
            onClick={handleImage}
          >
            Choose File
          </Button>
        )}
      </div>
    </Card>
  );
}
