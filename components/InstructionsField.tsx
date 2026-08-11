"use client";
import { Plus, X, ListOrdered } from "lucide-react";
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
    step: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue(`instructions.${step - 1}.image`, {
      step,
      url: "",
      path: "",
      file,
    } as any);
  };

  const handleImageDelete = async (e: React.MouseEvent, step: number) => {
    e.stopPropagation();
    const image = form.getValues(`instructions.${step - 1}.image`);
    if (image?.path) {
      await deleteImage(image.path);
    }
    form.setValue(`instructions.${step - 1}.image`, undefined);
  };

  const handleInstructionDelete = async (
    e: React.MouseEvent,
    index: number,
  ) => {
    await handleImageDelete(e, index + 1);
    removeInstruction(index);
  };

  return (
    <Card className="border-border bg-card/70">
      <CardHeader className="space-y-2">
        {/* <div className="flex items-center gap-2 text-primary">
          <ListOrdered className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Instructions
          </span>
        </div> */}
        <CardTitle>Instructions</CardTitle>
        <CardDescription className="text-sm leading-6">
          Step-by-step how to prepare the dish.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {instructionFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-5 rounded-lg border border-border/60 p-4 sm:p-5 md:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="text-base font-semibold text-foreground">
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
                  className="h-9 w-9 text-error hover:bg-error/10 hover:text-error"
                >
                  <X className="h-4 w-4" />
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
                {watchInstructions[index].image ? (
                  <div className="flex w-full flex-col items-center">
                    <div className="h-56 w-full">
                      {(watchInstructions[index].image as PreviewImage)?.url ? (
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
                      onClick={(e) => handleImageDelete(e, index + 1)}
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
              onChange={(e) => handleImageChange(e, index + 1)}
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
          className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </Button>
      </CardContent>
    </Card>
  );
}
