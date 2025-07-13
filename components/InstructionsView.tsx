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
    <Card className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Instructions
      </h2>
      <div className="space-y-6">
        {instructions.map((instruction: Instruction) => (
          <div key={instruction.step} className="flex space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
              {instruction.step}
            </div>

            {instruction.image?.url && (
              <Image
                src={instruction.image?.url}
                width={400}
                height={400}
                alt={`${instruction.step} image`}
              />
            )}

            <div className="flex-1">
              <h2 className="font-semibold text-2xl text-gray-800 dark:text-gray-200 mb-2">
                {instruction.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {instruction.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>⏱️ {instruction.time}</span>
              </div>
              {instruction.tips && (
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    <strong>Tip:</strong> {instruction.tips}
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
