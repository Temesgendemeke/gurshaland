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
import { InstructionImage } from "@/utils/types/recipe";
import { deleteImage } from "@/actions/Recipe/image";

type Instruction = {
  id: string;
  title: string;
  description: string;
  time: string;
  tips: string;
  step: number;
  image?: InstructionImage;
};

type InstructionsFieldProps = {
  form: any;
  instructionFields: Instruction[] | any;
  appendInstruction: (instruction: Omit<Instruction, "id">) => void;
  removeInstruction: (index: number) => void;
  images: { step: number; image: File }[];
  setImage: React.Dispatch<
    React.SetStateAction<{ step: number; image: File }[]>
  >;
};

export default function InstructionsField({
  form,
  instructionFields,
  appendInstruction,
  removeInstruction,
  images,
  setImage,
}: InstructionsFieldProps) {
  const user = useAuth((store) => store.user);

  const handleImage = (input_cls: string) => {
    document.getElementById(input_cls)?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    step: number
  ) => {
    const files = e.target.files;
    const file = files && files[0];
    if (!file) return;
    setImage((prev) => [...prev, { step, image: file }]);

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
    index: number
  ) => {
    removeInstruction(index);
    await handleImageDelete(e, index + 1);
    await removeInstruction(index);
  };

  const handleImageDelete = async (e: React.MouseEvent, step: number) => {
    e.stopPropagation();
    await deleteImage(form.getValues(`instructions.${step - 1}.image.path`));
    form.setValue(`instructions.${step - 1}.image`, undefined);
    setImage((prev) => prev.filter((img) => img.step != step));
  };

  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Instructions
        </h2>
      </div>
      <div className="space-y-6">
        {instructionFields.map((field: any, index: number) => (
          <div
            key={field.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
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
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div
                className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer"
                onClick={() =>
                  document.getElementById(`input-${index + 1}`)?.click()
                }
              >
                {images.find((img) => img.step === index + 1)?.image ? (
                  <div className="flex flex-col items-center w-full">
                    <Image
                      src={URL.createObjectURL(
                        images.find((img) => img.step === index + 1)
                          ?.image as File
                      )}
                      width={800}
                      height={400}
                      alt="Recipe Preview"
                      className="max-h-48 w-full rounded-lg mb-2 object-contain"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
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
                    className="mt-4 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
                    onClick={() => handleImage(`input-${index + 1}`)}
                  >
                    Choose File
                  </Button>
                )}
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
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>Time Required</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 15 min" {...field} />
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
                className="border-emerald-300 my-5 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
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
