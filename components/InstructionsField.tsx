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

type Instruction = {
  id: string;
  title: string;
  description: string;
  time: string;
  tips: string;
};

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
  return (
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Instructions
        </h2>
        <Button
          type="button"
          onClick={() =>
            appendInstruction({
              title: "",
              description: "",
              time: "",
              tips: "",
            })
          }
          variant="outline"
          size="sm"
          className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>
      <div className="space-y-6">
        {instructionFields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Step {index + 1}
              </span>
              {instructionFields.length > 1 && (
                <Button
                  onClick={() => removeInstruction(index)}
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
          </div>
        ))}
      </div>
    </Card>
  );
}
