import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  stepsDataForm,
} from "@/schema/recipeFormStepValidater";
import { Step } from "@/utils/types/EditForm";
import { BicepsFlexed, Book, Carrot, InfoIcon } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

const stepSchema = [step1Schema, step2Schema, step3Schema, step4Schema];

export const steps: Step[] = [
  {
    id: "basic",
    name: "Basic Information",
    icon: InfoIcon,
  },
  {
    id: "ingredient",
    name: "ingredient",
    icon: Carrot,
  },
  {
    id: "instructions",
    name: "instructions",
    icon: Book,
  },
  {
    id: "nutrition",
    name: "nutrition",
    icon: BicepsFlexed,
  },
];

export const useMultiForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<stepsDataForm>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const getCurrentStepSchema = () => stepSchema[currentStep];

  const goToNextStep = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  const updateFormData = (data: Partial<stepsDataForm>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const submitForm = () => {
    setIsSubmitted(true);
    if (!isLastStep) goToNextStep();
  };

  const resetForm = () => {
    setCurrentStep(0);
    setFormData({});
    setIsSubmitted(false);
  };

  return {
    currentStep,
    formData,
    isSubmitted,
    isFirstStep,
    isLastStep,
    getCurrentStepSchema,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    submitForm,
    resetForm,
  };
};
