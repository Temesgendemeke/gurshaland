import React from "react";
import { ChefHat, NotebookPen } from "lucide-react";
import { Blog } from "@/utils/types/blog";
import format_calories from "@/utils/formatcalories";

type ContentSectionItem = {
  body?: string;
  title?: string;
  ingredients?: { amount: number; name: string }[];
  instructions?: string[];
  items?: string[];
};

const ArticleContent = ({ blogPost }: { blogPost: Blog }) => {
  return (
    <div className="mx-auto w-full max-w-3xl">
      {blogPost?.contents?.map((section, index) => {
        const content = section as ContentSectionItem;
        switch (content.body) {
          case "paragraph":
            return (
              <p
                key={index}
                className="mb-6 text-[1.0625rem] leading-[1.85] text-foreground/80"
              >
                {content.body}
              </p>
            );
          case content.title:
            return (
              <h2
                key={index}
                className="mb-5 mt-10 border-l-2 border-primary pl-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {content.title}
              </h2>
            );
          case "recipe":
            return (
              <div
                key={index}
                className="my-10 overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_1px_2px_hsl(215_15%_10%/0.04)]"
              >
                <div className="flex items-center gap-3 border-b border-border/70 bg-muted/40 px-6 py-4 sm:px-8">
                  <ChefHat className="h-5 w-5 shrink-0 text-primary" />
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {content.title}
                  </h3>
                </div>
                <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <div>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Ingredients
                    </p>
                    <ul className="space-y-2.5">
                      {content.ingredients?.map((ingredient, i) => (
                        <li
                          key={i}
                          className="flex items-baseline gap-2 text-sm"
                        >
                          <span className="shrink-0 font-semibold text-foreground">
                            {format_calories(Number(ingredient.amount) || 0)}
                          </span>
                          <span className="text-muted-foreground">
                            {ingredient.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Method
                    </p>
                    <ol className="space-y-4">
                      {content.instructions?.map((instruction, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed text-muted-foreground">
                            {instruction}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            );
          case "tips":
            return (
              <div
                key={index}
                className="my-10 rounded-xl border-l-2 border-primary bg-primary/5 p-6 sm:p-8"
              >
                <div className="mb-5 flex items-center gap-3">
                  <NotebookPen className="h-5 w-5 shrink-0 text-primary" />
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {content.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {content.items?.map((tip, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-foreground/80">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ArticleContent;
