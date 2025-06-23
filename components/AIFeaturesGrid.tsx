import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import aiFeatures from "@/constants/aiFeatures";

function AIFeaturesGrid({
  features,
  selected,
  onSelect,
}: {
  features: typeof aiFeatures;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <Card
            key={feature.id}
            className={`modern-card modern-card-hover cursor-pointer transition-all duration-300 ${
              selected === feature.id ? "ring-2 ring-emerald-500 shadow-lg" : ""
            }`}
            onClick={() => onSelect(feature.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
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
                className="mt-4 text-emerald-600 hover:text-emerald-700 p-0"
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
