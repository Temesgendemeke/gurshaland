"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import React from "react";

interface RecipeImageFieldProps {
  image?: File | string;
  setImage: (file?: File | string) => void;
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
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Recipe Image
      </h2>
      <div
        className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer"
        onClick={() => document.getElementById("recipe-image-input")?.click()}
      >
        {image ? (
          <div className="flex flex-col items-center">
            <img
              src={typeof image === "string" ? image : URL.createObjectURL(image)}
              alt="Recipe Preview"
              className="max-h-48 rounded-lg mb-2 object-contain"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
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
            <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
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
            className="mt-4 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
            onClick={handleImage}
          >
            Choose File
          </Button>
        )}
      </div>
    </Card>
  );
}
