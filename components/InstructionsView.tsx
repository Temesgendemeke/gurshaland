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
    <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
      <h2 className="text-2xl font-bold text-foreground mb-6">Instructions</h2>
      <div className="space-y-6">
        {instructions.map((instruction: Instruction) => (
          <div key={instruction.step} className="flex space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-sm">
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
              <h2 className="font-semibold text-2xl text-foreground mb-2">
                {instruction.title}
              </h2>
              <p className="text-muted-foreground mb-2">
                {instruction.description}
              </p>
              <div
                className={`flex items-center space-x-4 text-sm text-muted-foreground/80 ${instruction.time ? "" : "hidden"}`}
              >
                <span>⏱️ {instruction.time} min</span>
              </div>
              {instruction.tips && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm text-foreground/90">
                    <strong className="text-primary">Tip:</strong>{" "}
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
