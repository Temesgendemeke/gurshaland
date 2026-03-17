import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Instruction } from "@/utils/types/recipe";

const InstructionsView = ({
  instructions,
}: {
  instructions: Instruction[];
}) => {
  return (
    <Card className="p-6 bg-card border border-border rounded-lg shadow-modern">
      <h2 className="heading-secondary text-2xl md:text-3xl border-b border-border pb-3 mb-4">
        Instructions
      </h2>
      <div className="space-y-6">
        {instructions.map((instruction: Instruction) => (
          <div key={instruction.step} className="flex gap-4">
            <div
              className="shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-sm"
              aria-hidden="true"
            >
              {instruction.step}
            </div>

            {instruction.image?.url && (
              <div className="w-60 h-60">
                <Image
                  src={instruction.image?.url}
                  width={400}
                  height={400}
                  alt={`${instruction.step} image`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-semibold text-xl text-foreground mb-1">
                {instruction.title}
              </h3>
              <p className="text-muted-foreground mb-1 leading-relaxed">
                {instruction.description}
              </p>
              {instruction.time && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span aria-label="Time">⏱️ {instruction.time} min</span>
                </div>
              )}
              {instruction.tips && (
                <div className="mt-3 p-3 bg-muted rounded-md border border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Tip:</span>{" "}
                    {instruction.tips}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InstructionsView;
