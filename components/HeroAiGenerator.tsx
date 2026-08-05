"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import HeroImage from "./HeroImage";
import AIRecipeGenerator from "./AIRecipeGenerator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";

export default function HeroAiGenerator() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <>
      <div className="relative">
        <HeroImage />
        <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex justify-center px-4">
          <Button
            onClick={() => setOpen(true)}
            size="lg"
            className="btn-primary-modern font-semibold text-primary-foreground shadow-xl"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Recipe with AI
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl overflow-y-auto "
        >
          <SheetTitle className="sr-only">Generate a Recipe with AI</SheetTitle>
          <div className="mt-4">
            <AIRecipeGenerator />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
