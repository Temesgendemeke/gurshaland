import { Clock, Lightbulb } from "lucide-react";
import RecipeImage from "./RecipeImage";

const InstructionsSection = ({ instructions }: { instructions: any[] }) => {
  const list = instructions ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Instructions
        </h3>
        <span className="text-sm tabular-nums text-muted-foreground">
          {list.length} {list.length === 1 ? "step" : "steps"}
        </span>
      </div>

      <ol className="space-y-8">
        {list.map((instruction, idx) => (
          <li key={idx} className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 flex-col sm:block">
              <span className="text-sm font-bold tabular-nums text-primary">
                {String(idx + 1).padStart(2, "0")}
              </span>
              {instruction?.image?.url && (
                <div className="mt-2  w-full  shrink-0 overflow-hidden rounded-lg ring-1 ring-border/50 sm:w-full">
                  <RecipeImage
                    src={instruction.image.url}
                    alt={instruction.title || `Step ${idx + 1}`}
                    sizes="112px"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 md:mt-8">
                <h4 className="text-base font-semibold tracking-tight text-foreground">
                  {instruction.title}
                </h4>
                {instruction.time ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {instruction.time} min
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {instruction.description}
              </p>
              {instruction.tips ? (
                <p className="mt-3 flex items-start gap-2 border-l-2 border-primary/50 bg-muted/50 px-3 py-2.5 text-xs leading-relaxed text-foreground/80">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{instruction.tips}</span>
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default InstructionsSection;
