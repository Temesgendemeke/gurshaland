"use client";
import { Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { deleteImage } from "@/actions/Recipe/image";
import { compressImageToFile } from "@/utils/compressImage";
import { Skeleton } from "./ui/skeleton";
import { formSchema } from "@/utils/schema";
import { z } from "zod";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";

type FormValues = z.infer<typeof formSchema>;

type InstructionsFieldProps = {
  form: UseFormReturn<FormValues>;
  instructionFields: FieldArrayWithId<FormValues, "instructions">[];
  appendInstruction: UseFieldArrayAppend<FormValues, "instructions">;
  removeInstruction: UseFieldArrayRemove;
};

export default function InstructionsField({
  form,
  instructionFields,
  appendInstruction,
  removeInstruction,
}: InstructionsFieldProps) {
  const watchInstructions = form.watch("instructions");

  type PreviewImage = {
    path?: string;
    url?: string;
    instruction_id?: number;
    file?: File;
  };

  const handleImage = (inputId: string) => {
    document.getElementById(inputId)?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const optimizedFile = await compressImageToFile(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.82,
      mimeType: "image/webp",
    });
    const existing = form.getValues(`instructions.${index}`);
    form.setValue(`instructions.${index}.image`, {
      step: existing?.step ?? index + 1,
      url: "",
      path: "",
      file: optimizedFile,
    } as any);
  };

  const handleImageDelete = async (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const image = form.getValues(`instructions.${index}.image`);
    if (image?.path) {
      await deleteImage(image.path);
    }
    form.setValue(`instructions.${index}.image`, undefined);
  };

  const handleInstructionDelete = async (
    e: React.MouseEvent,
    index: number,
  ) => {
    await handleImageDelete(e, index);
    removeInstruction(index);
  };

  return (
    <Card className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-none space-y-6">
      <CardHeader className="p-0 pb-4 border-b border-border/60">
        <CardTitle className="font-gosh text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Step-by-Step Instructions
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Clear, numbered steps for preparing and cooking this dish.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-5">
        {instructionFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-5 rounded-xl border border-border/80 bg-background/50 p-4 sm:p-5 md:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Step {index + 1}
                </span>
              </div>
              <FormField
                control={form.control}
                name={`instructions.${index}.step`}
                render={({ field }) => (
                  <Input type="hidden" {...field} value={index + 1} />
                )}
              />
              {instructionFields.length > 1 && (
                <Button
                  onClick={(e) => handleInstructionDelete(e, index)}
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div
                className="flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border/70 p-6 text-center transition-colors hover:border-primary/50"
                onClick={() =>
                  document.getElementById(`input-${index + 1}`)?.click()
                }
              >
                {watchInstructions?.[index]?.image ? (
                  <div className="flex w-full flex-col items-center">
                    <div className="h-56 w-full">
                      {(watchInstructions[index].image as PreviewImage)?.file ||
                      (watchInstructions[index].image as PreviewImage)?.url ? (
                        <Image
                          src={
                            (watchInstructions[index].image as PreviewImage)
                              ?.file
                              ? URL.createObjectURL(
                                  (
                                    watchInstructions[index]
                                      .image as PreviewImage
                                  )?.file as File,
                                )
                              : ((
                                  watchInstructions[index].image as PreviewImage
                                )?.url ?? "")
                          }
                          width={800}
                          height={400}
                          alt="Recipe Preview"
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-full w-full">
                          <Skeleton className="h-full w-full animate-pulse rounded-lg" />
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-error hover:bg-error/10 hover:text-error/80"
                      onClick={(e) => handleImageDelete(e, index)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground/80">
                      Step Image
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => handleImage(`input-${index + 1}`)}
                    >
                      Choose File
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name={`instructions.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel>Step Title</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11"
                          placeholder="e.g., Prepare the batter"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`instructions.${index}.time`}
                  render={({ field }) => (
                    <FormItem className="gap-2">
                      <FormLabel>Time Required (minute)</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11"
                          placeholder="e.g., 15"
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <input
              id={`input-${index + 1}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, index)}
            />

            <FormField
              control={form.control}
              name={`instructions.${index}.description`}
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Describe this step</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-30 resize-y"
                      placeholder="Describe this step in detail..."
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`instructions.${index}.tips`}
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Tips (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 resize-y"
                      placeholder="Any helpful tips for this step..."
                      rows={2}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            appendInstruction({
              title: "",
              description: "",
              time: 0,
              tips: "",
              step: instructionFields.length + 1,
              image: undefined,
            })
          }
          className="w-full h-10 rounded-xl border border-dashed border-border/80 bg-background/50 hover:bg-accent hover:border-primary/50 text-foreground font-medium text-xs sm:text-sm active:scale-[0.99] gap-1.5"
        >
          <Plus className="h-4 w-4 text-primary" />
          <span>Add Step</span>
        </Button>
      </CardContent>
    </Card>
  );
}
