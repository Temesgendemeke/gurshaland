"use client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import aiFeatures from "@/constants/aiFeatures";
import { useRouter } from "next/navigation";

function AIFeaturesGrid({
  features,
  selected,
  onSelect,
  onGenerateRecipe,
}: {
  features: typeof aiFeatures;
  selected: string;
  onSelect: (id: string) => void;
  onGenerateRecipe: () => void;
}) {
  const router = useRouter();
  const handleClick = (featureId: string) => {
    if (featureId === "recipe-generator") {
      onGenerateRecipe();
    }
    if (featureId === "/meal-planner") {
      router.push("/meal-planner");
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <Card
            key={feature.id}
            className={`modern-card modern-card-hover cursor-pointer transition-all duration-300 ${
              selected === feature.id ? "ring-2 ring-primary shadow-lg" : ""
            }`}
            onClick={() => onSelect(feature.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary-foreground" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <h3 className="text-xl font-bold heading-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-body text-sm leading-relaxed">
                {feature.description}
              </p>
              <Button
                variant="ghost"
                size="sm"
                disabled={feature.badge == "Coming Soon"}
                aria-disabled={feature.badge == "Coming Soon"}
                className="mt-4 text-primary p-4 hover:text-primary-foreground hover:bg-primary"
                onClick={() => handleClick(feature.id)}
              >
                Try Now →
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
export default AIFeaturesGrid;
