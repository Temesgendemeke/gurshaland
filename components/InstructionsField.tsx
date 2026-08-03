"use client";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/store/useAuth";
import Image from "next/image";
import { Instruction, InstructionImage } from "@/utils/types/recipe";
import { deleteImage } from "@/actions/Recipe/image";
import ImageBoxSkeleton from "./skeleton/ImageBoxSkeleton";
import { Skeleton } from "./ui/skeleton";

type InstructionsFieldProps = {
  form: any;
  instructionFields: Instruction[] | any;
  appendInstruction: (instruction: Omit<Instruction, "id">) => void;
  removeInstruction: (index: number) => void;
};

export default function InstructionsField({
  form,
  instructionFields,
  appendInstruction,
  removeInstruction,
}: InstructionsFieldProps) {
  const user = useAuth((store) => store.user);
  const watchInstructions = form.watch("instructions");

  const handleImage = (input_cls: string) => {
    document.getElementById(input_cls)?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    step: number,
  ) => {
    const files = e.target.files;
    const file = files && files[0];
    if (!file) return;
    form.setValue(`instructions.${step - 1}.image`, {
      step,
      url: "",
      path: "",
      file,
    });

    // if (file && user) {
    //   try {
    //     const url = await uploadImage(file, user.id);
    //     field.onChange({ path: url });
    //   } catch (error) {
    //     toast.error("Failed to upload image.");
    //   }
    // }
  };

  const handleInstructionDelete = async (
    e: React.MouseEvent,
    index: number,
  ) => {
    removeInstruction(index);
    await handleImageDelete(e, index + 1);
    await removeInstruction(index);
  };

  const handleImageDelete = async (e: React.MouseEvent, step: number) => {
    e.stopPropagation();
    await deleteImage(form.getValues(`instructions.${step - 1}.image.path`));
    form.setValue(`instructions.${step - 1}.image`, undefined);
  };

  return (
    <Card className="p-6 bg-card/70 border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Instructions</h2>
      </div>

      <div className="space-y-6">
        {instructionFields.map((field: any, index: number) => (
          <div
            key={field.id}
            className="border border-border/60 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-foreground">
                Step {index + 1}
              </span>
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
                  size="sm"
                  type="button"
                  className="text-error hover:text-error/80 hover:bg-error/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div
                className="border-2 border-dashed border-border/70 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() =>
                  document.getElementById(`input-${index + 1}`)?.click()
                }
              >
                {watchInstructions[index].image ? (
                  <div className="flex flex-col items-center w-full  ">
                    <div className="w-60  sm:w-80 h-56 ">
                      {watchInstructions[index].image?.url ? (
                        <Image
                          src={
                            watchInstructions[index].image?.file
                              ? (URL.createObjectURL(
                                  watchInstructions[index].image?.file,
                                ) ?? "")
                              : (watchInstructions[index].image?.url ?? "")
                          }
                          width={800}
                          height={400}
                          alt="Recipe Preview"
                          className="h-full w-full rounded-lg mb-2 object-cover"
                        />
                      ) : (
                        <div className="w-full h-full">
                          <Skeleton className="w-full h-full rounded-lg animate-pulse " />
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-error hover:text-error/80 hover:bg-error/10"
                      onClick={(e) => handleImageDelete(e, index + 1)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => handleImage(`input-${index + 1}`)}
                  >
                    Choose File
                  </Button>
                )}
                {/* {

                } */}
              </div>
              <FormField
                control={form.control}
                name={`instructions.${index}.image`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input
                        id={`input-${index + 1}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, index + 1)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`instructions.${index}.title`}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Step Title</FormLabel>
                    <FormControl>
                      <Input
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
                  <FormItem className="col-span-2 lg:col-span-1">
                    <FormLabel>Time Required(minute)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 15n" {...field} type="number" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`instructions.${index}.description`}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
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
                <FormItem>
                  <FormLabel>Tips (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any helpful tips for this step..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  appendInstruction({
                    title: "",
                    description: "",
                    time: "",
                    tips: "",
                    step: instructionFields.length + 1,
                    image: undefined,
                  })
                }
                variant="outline"
                size="sm"
                className="my-5 border-primary/40 text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
