import React from "react";
import { Card } from "./ui/card";
import { Blog } from "@/utils/types/blog";
import format_calories from "@/utils/formatcalories";

const ArticleContent = ({ blogPost }: { blogPost: Blog }) => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
      {blogPost?.contents?.map((section, index) => {
        switch (section.body) {
          case "paragraph":
            return (
              <p
                key={index}
                className="text-muted-foreground leading-relaxed mb-6"
              >
                {section.body}
              </p>
            );
          case section.title:
            return (
              <h2
                key={index}
                className="text-2xl font-bold text-foreground mt-8 mb-4"
              >
                {section.title}
              </h2>
            );
          case "recipe":
            return (
              <Card key={index} className="p-6 my-8 bg-card border-border">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {section.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Ingredients:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {section.ingredients?.map((ingredient, i) => (
                        <li key={i}>
                          {format_calories(parseInt(ingredient.amount))}{" "}
                          {ingredient.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Instructions:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      {section.instructions?.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Card>
            );
          case "tips":
            return (
              <Card key={index} className="p-6 my-8 bg-card border-border">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {section.title}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {section.items?.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </Card>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ArticleContent;
