import React from "react";
import Image from "next/image";
import { Blog, Content } from "@/utils/types/blog";
import BlogRecipeCard from "./blog/BlogRecipeCard";

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
    <div className="py-4 first:pt-0 border-b border-border/30 last:border-b-0">
      {/* Section heading */}
      {hasTitle && (
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-gosh">
          {section.title}
        </h2>
      )}

      {/* Body text */}
      {hasBody && (
        <div className="text-base sm:text-lg leading-[1.85] text-foreground/85 font-normal whitespace-pre-line  ">
          {section.body}
        </div>
      )}



      {/* Connected Image & Recipe Block (or standalone items) */}
      {hasImage && isRecipe ? (
        <div className="my-6 w-full overflow-hidden rounded-xl border border-border/70 bg-card/60">
          {/* Top: Flush Image */}
          <div className="relative aspect-[16/9] w-full max-h-[460px] border-b border-border/60 bg-muted/20">
            <Image
              src={section.image!.url}
              alt={section.title || "Section image"}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
          {/* Bottom: Connected Recipe Details & Instructions */}


          <BlogRecipeCard
            title={section.recipe?.title}
            ingredients={section.ingredients}
            instructions={section.instructions}
            tips={hasItems ? section.items : undefined}
            className="p-2 sm:p-4"
          />
        </div>
      ) : (
        <>
          {/* Standalone Content image */}
          {hasImage && (
            <div className="my-6 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20">
              <div className="relative aspect-[16/9] w-full max-h-[460px]">
                <Image
                  src={section.image!.url}
                  alt={section.title || "Section image"}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </div>
          )}


          {/* Standalone Recipe Card */}
          {isRecipe && (
            <BlogRecipeCard
              title={section.recipe?.title}
              ingredients={section.ingredients}
              instructions={section.instructions}
              tips={hasItems ? section.items : undefined}
            />
          )}
        </>
      )}


      {/* Standalone Tips callout (when not part of a recipe) */}
      {!isRecipe && hasItems && (
        <div className="my-6 border-l-2 border-primary/50 bg-muted/20 pl-4 pr-3 py-3 rounded-r-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Tips & Notes
          </p>
          <ul className="space-y-1.5">
            {section.items!.map((tip, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-foreground/80 flex items-start gap-2"
              >
                <span className="text-primary font-bold text-xs mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
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
