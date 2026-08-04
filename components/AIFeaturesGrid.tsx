"use client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {features.map((feature) => {
        const IconComponent = feature.icon;
        const isComingSoon = feature.badge === "Coming Soon";
        return (
          <Card
            key={feature.id}
            className={`bg-card cursor-pointer transition-colors ${
              selected === feature.id
                ? "border-primary/60"
                : "hover:border-border/70"
            }`}
            onClick={() => onSelect(feature.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-muted text-muted-foreground rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-muted-foreground font-medium">
                  {feature.badge}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold heading-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-body text-sm leading-relaxed">
                {feature.description}
              </p>
              {isComingSoon ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Coming soon
                </p>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleClick(feature.id)}
                >
                  Try now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
export default AIFeaturesGrid;
