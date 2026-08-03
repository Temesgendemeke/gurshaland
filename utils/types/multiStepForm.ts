import { stepsDataForm } from "@/schema/recipeFormStepValidater";
import { FormStep } from "./EditForm";

export interface MultiStepFormProps {
  currentStep: FormStep;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  steps: FormStep[];
  setStep: (state: Partial<MultiStepFormProps>) => void;
  resetForm: () => void;
  getCurrentSchema: () => Partial<stepsDataForm>;
}
