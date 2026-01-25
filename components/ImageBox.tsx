"use client";
import deleteImageFromStorage, { deleteImageFromDb } from "@/actions/Image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface ImageBoxProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  inputcls: string;
  field: Path<T>;
  label: string;
  onFileSelected?: (
    file: File,
    oldPath?: string,
  ) => Promise<{ url: string; path: string } | void>;
  deleteImage: (path: string) => Promise<void>;
}

export default function ImageBox<T extends FieldValues = FieldValues>({
  form,
  inputcls,
  field,
  label,
  onFileSelected,
  deleteImage,
}: ImageBoxProps<T>) {
  const handleImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById(inputcls)?.click();
  };

  const fieldValue =
    (form.watch(field as any) as any) ?? (form.getValues(field as any) as any);
  const imageValue = (fieldValue as any)?.file as File | string | undefined;
  const imageURl = (fieldValue as any)?.url as string | undefined;
  const oldPath = (fieldValue as any)?.path as string | undefined;

  const getImageSrc = (): string => {
    if (imageValue) {
      return URL.createObjectURL(imageValue as File);
    }
    return imageURl || "";
  };

  const handleDeleteImage = async () => {
    if (oldPath) {
      console.log("from btn", oldPath);
      // await deleteImageFromStorage([oldPath]);
      await deleteImage(oldPath);
    }
    form.setValue(field as any, undefined as any, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Card className="p-6 bg-card/70 border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">{label} Image</h2>

      {/*{JSON.stringify(oldPath)}*/}
      {/* Preview and controls */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/60 transition-colors cursor-pointer"
        onClick={() => document.getElementById(inputcls)?.click()}
      >
        {imageValue || imageURl ? (
          <div className="flex flex-col items-center">
            <Image
              width={400}
              height={400}
              src={getImageSrc()}
              alt="Recipe Preview"
              className="max-h-48 rounded-lg mb-2 object-contain"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-error hover:text-error/80"
              onClick={async (e) => {
                e.stopPropagation();
                await handleDeleteImage();
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
          id={inputcls}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const previewUrl = URL.createObjectURL(file);
              form.setValue(
                `${field}` as Path<T>,
                {
                  url: previewUrl,
                  file,
                  path: oldPath || "",
                } as any,
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              );
              if (onFileSelected) {
                try {
                  const row = await onFileSelected(file, oldPath);
                  if (
                    row &&
                    typeof row.url === "string" &&
                    typeof row.path === "string"
                  ) {
                    form.setValue(
                      `${field}` as Path<T>,
                      {
                        url: row.url,
                        path: row.path,
                        file: null,
                      } as any,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  }
                } catch (_) {
                  // leave optimistic preview; caller can handle error UI
                }
              }
            }
          }}
        />
        {!imageValue && (
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
