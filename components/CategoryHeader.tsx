import React from "react";

const CategoryHeader = ({
  currentCategory,
}: {
  currentCategory: {
    color: string;
    name: string;
    description: string;
  };
}) => {
  return (
    <div className="text-center mb-12">
      <div className="inline-block p-4 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 mb-6">
        <h1 className="text-4xl font-bold text-foreground">
          {currentCategory.name}
        </h1>
      </div>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {currentCategory.description}
      </p>
    </div>
  );
};

export default CategoryHeader;
