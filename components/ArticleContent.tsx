import React from "react";
import Image from "next/image";
import { Blog, Content } from "@/utils/types/blog";
import format_calories from "@/utils/formatcalories";

const ContentSection = ({ section }: { section: Content }) => {
  const hasTitle = !!section.title?.trim();
  const hasBody = !!section.body?.trim();
  const hasIngredients =
    Array.isArray(section.ingredients) && section.ingredients.length > 0;
  const hasInstructions =
    Array.isArray(section.instructions) && section.instructions.length > 0;
  const hasItems = Array.isArray(section.items) && section.items.length > 0;
  const hasImage = !!section.image?.url;
  const isRecipe = hasIngredients || hasInstructions;

  return (
    <div className="py-10 first:pt-0">
      {/* Section heading */}
      {hasTitle && (
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {section.title}
        </h2>
      )}

      {/* Body text */}
      {hasBody && (
        <p className="text-[1.0625rem] leading-[1.85] text-foreground/80">
          {section.body}
        </p>
      )}

      {/* Content image */}
      {hasImage && (
        <div className="my-8">
          <div className="relative aspect-[16/9] bg-muted">
            <Image
              src={section.image!.url}
              alt={section.title || "Section image"}
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Recipe  clean two-column layout */}
      {isRecipe && (
        <div className="my-8 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {hasIngredients && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Ingredients
              </p>
              <ul className="space-y-2">
                {section.ingredients!.map((ingredient, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-2 text-sm"
                  >
                    <span className="shrink-0 font-medium text-foreground">
                      {format_calories(Number(ingredient.amount) || 0)}
                    </span>
                    <span className="text-muted-foreground">
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasInstructions && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Method
              </p>
              <ol className="space-y-3">
                {section.instructions!.map((instruction, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-[0.6875rem] font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-foreground/80">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Tips / bullet list */}
      {hasItems && !isRecipe && (
        <ul className="my-6 space-y-2.5">
          {section.items!.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
              <span className="text-foreground/80">{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ArticleContent = ({ blogPost }: { blogPost: Blog }) => {
  const sections = blogPost?.contents;

  if (!sections || sections.length === 0) {
    return (
      <p className="text-muted-foreground">No content available.</p>
    );
  }

  return (
    <div>
      {sections.map((section, index) => (
        <ContentSection key={section.id ?? index} section={section} />
      ))}
    </div>
  );
};

export default ArticleContent;
