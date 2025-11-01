import { ZodType } from "zod";
import { LucideIcon } from "lucide-react";
import { CombinedCheckoutType } from "@/schema/recipeFormStepValidater";

type FieldsKeys = keyof CombinedCheckoutType;

export type FormStep = {
  title: string;
  position: number;
  validationSchema: ZodType<unknown>;
  component: React.ReactElement;
  icon: LucideIcon;
  fields: FieldsKeys[];
};

export type StoredFormState = {
  currentStepIndex: number;
  formValues: Record<string, unknown>;
};

export type Step = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};
