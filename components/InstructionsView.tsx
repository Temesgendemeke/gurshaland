"use client";

import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Clock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Instruction } from "@/utils/types/recipe";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const InstructionsView = ({
  instructions,
}: {
  instructions: Instruction[];
}) => {
  const reduce = useReducedMotion();

  return (
    <Card className="p-6 bg-card border border-border rounded-lg">
      <h2 className="heading-secondary text-2xl md:text-3xl border-b border-border pb-3 mb-6">
        Instructions
      </h2>
      {instructions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No instructions listed yet.
        </p>
      ) : (
        <div className="space-y-8">
          {instructions.map((instruction: Instruction) => (
            <motion.div
              key={instruction.step}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: Math.min(instruction.step * 0.04, 0.3),
                ease,
              }}
              className="group flex gap-4"
            >
              <div className="shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {instruction.step}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                {instruction.image?.url && (
                  <div className="mb-3 w-full max-w-[15rem] overflow-hidden rounded-lg border border-border">
                    <Image
                      src={instruction.image?.url}
                      width={400}
                      height={400}
                      alt={`${instruction.title} image`}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <h3 className="font-semibold text-xl text-foreground mb-1">
                  {instruction.title}
                </h3>
                <p className="text-muted-foreground mb-1 leading-relaxed">
                  {instruction.description}
                </p>
                {instruction.time && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{instruction.time} min</span>
                  </div>
                )}
                {instruction.tips && (
                  <div className="mt-3 rounded-md border-l-2 border-primary bg-muted p-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Tip:
                      </span>{" "}
                      {instruction.tips}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default InstructionsView;
