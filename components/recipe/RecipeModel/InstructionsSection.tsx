import { Clock, Lightbulb } from "lucide-react";
import RecipeImage from "./RecipeImage";

const InstructionsSection = ({ instructions }: { instructions: any[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="heading-secondary text-xl md:text-2xl border-b border-border pb-3 flex items-baseline justify-between">
        <span>Instructions</span>
        <span className="text-sm font-normal text-muted-foreground">
          {instructions?.length ?? 0} steps
        </span>
      </h3>
      <div className="space-y-5">
        {instructions?.map((instruction, idx: number) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl border border-border/60 bg-card"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-44 w-full shrink-0 sm:h-40 sm:w-52 md:w-64">
                <RecipeImage
                  src={instruction?.image?.url}
                  alt={instruction.title || `Step ${idx + 1}`}
                  sizes="(max-width: 640px) 100vw, 256px"
                />
                <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-sm font-bold text-foreground backdrop-blur">
                  Step {idx + 1}
                </div>
              </div>
              <div className="flex-1 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-base font-semibold text-foreground">
                    {instruction.title}
                  </h4>
                  {instruction.time ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <Clock className="h-3.5 w-3.5" />
                      {instruction.time} min
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {instruction.description}
                </p>
                {instruction.tips ? (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{instruction.tips}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructionsSection;
