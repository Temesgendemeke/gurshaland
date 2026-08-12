import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { IconCircleDashed as CircleDashed } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const StatusSelect = ({ form }: { form: UseFormReturn<any> }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 pt-4"
    >
      <Card>
        <CardHeader>
          {/* <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CircleDashed className="h-4 w-4" strokeWidth={1.5} />
        </span> */}
          <CardTitle>Status</CardTitle>
          <CardDescription>
            Select the status of your blog post. Drafts are not visible to the
            public.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Select
                  defaultValue="draft"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status?.message &&
                  typeof form.formState.errors.status.message === "string" && (
                    <p className="text-sm text-error" role="alert">
                      {form.formState.errors.status.message}
                    </p>
                  )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatusSelect;
