"use client";
import { ArrowRight, Camera, Check, ImagePlus } from "lucide-react";
import aiFeatures from "@/constants/aiFeatures";
import { useRouter } from "next/navigation";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

function IngredientsBackground() {
  const items = ["chickpea flour", "onions", "garlic", "berbere"];
  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid w-full max-w-md grid-cols-1 gap-2 px-8 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="h-3 w-3" />
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MealPlannerBackground() {
  const days = [
    { label: "Mon", h: "3.5rem" },
    { label: "Tue", h: "5.5rem" },
    { label: "Wed", h: "4.5rem" },
  ];
  return (
    <div className="flex h-full items-end justify-center gap-4 px-6 pb-6">
      <div className="flex items-end gap-4 rounded-xl border border-border/60 bg-background/70 px-5 pt-5 pb-3">
        {days.map((day) => (
          <div
            key={day.label}
            className="flex w-12 flex-col items-center gap-2"
          >
            <div
              className="w-full rounded-t-md bg-primary/30"
              style={{ height: day.h }}
            />
            <span className="text-xs text-muted-foreground">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoodRecognitionBackground() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-28 w-36 overflow-hidden rounded-lg border border-border bg-primary/10">
        <div className="absolute inset-0 grid place-items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
            <Camera className="h-5 w-5 text-primary" />
          </span>
        </div>
        <div className="absolute bottom-2 left-2 h-1.5 w-1/3 rounded-full bg-background/70" />
        <div className="absolute right-2 bottom-2 h-1.5 w-1/4 rounded-full bg-background/40" />
      </div>
    </div>
  );
}

function CookingAssistantBackground() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="max-w-[13.75rem] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm text-foreground">
        Simmer the berbere until the oil turns deep red  then add the onions.
      </div>
    </div>
  );
}

function PhotoToRecipeBackground() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="relative h-28 w-40 overflow-hidden rounded-lg border border-border bg-primary/10">
        <div className="absolute inset-0 grid place-items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
            <ImagePlus className="h-5 w-5 text-primary" />
          </span>
        </div>
        <div className="absolute bottom-2 left-2 h-1.5 w-1/3 rounded-full bg-background/70" />
        <div className="absolute right-2 bottom-2 h-1.5 w-1/4 rounded-full bg-background/40" />
      </div>
    </div>
  );
}

function TranslatorBackground() {
  return (
    <div className="flex h-full items-center justify-center gap-3 px-6">
      <div className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm">
        ዶሮ ወጥ
      </div>
      <div className="flex items-center justify-center">
        <ArrowRight className="h-4 w-4 text-primary" />
      </div>
      <div className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm text-muted-foreground">
        Doro Wat
      </div>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        translate any Ethiopian recipe in one tap
      </span>
    </div>
  );
}

function AIFeaturesGrid({
  features,
  selected,
  onSelect,
}: {
  features: typeof aiFeatures;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const SetCookingAssistantOpen = useAppStore(
    (store) => store.SetCookingAssistantOpen,
  );
  const isCookingAssistantOpen = useAppStore(
    (store) => store.isCookingAssistantOpen,
  );

  const handleClick = (e: React.MouseEvent, featureId: string) => {
    const feature = features.find((f) => f.id === featureId);
    if (feature?.badge === "Coming Soon") return;
    e.preventDefault();
    onSelect(featureId);
    if (featureId === "recipe-generator") {
      router.push("/ai-features/generate-recipe");
    } else if (featureId === "/meal-planner") {
      router.push("/meal-planner");
    } else if (featureId === "photo-to-recipe") {
      router.push("/ai-features/food-photo");
    } else if (featureId === "cooking-assistant") {
      SetCookingAssistantOpen(!isCookingAssistantOpen);
    }
  };

  const backgroundFor = (id: string) => {
    switch (id) {
      case "recipe-generator":
        return <IngredientsBackground />;
      case "food-recognition":
        return <FoodRecognitionBackground />;
      case "cooking-assistant":
        return <CookingAssistantBackground />;
      case "/meal-planner":
        return <MealPlannerBackground />;
      case "photo-to-recipe":
        return <PhotoToRecipeBackground />;
      case "recipe-translator":
        return <TranslatorBackground />;
      default:
        return null;
    }
  };

  const cards: Record<string, string> = {
    "recipe-generator": "sm:col-span-2",
    "/meal-planner": "sm:col-span-1",
    "food-recognition": "sm:col-span-1",
    "cooking-assistant": "sm:col-span-1",
    "photo-to-recipe": "sm:col-span-1",
    "recipe-translator": "sm:col-span-3",
  };

  return (
    <>
      <BentoGrid>
        {features.map((feature) => {
          const comingSoon = feature.badge === "Coming Soon";
          return (
            <BentoCard
              key={feature.id}
              name={feature.title}
              className={cn(
                cards[feature.id],
                selected === feature.id && "border-primary/60",
              )}
              background={backgroundFor(feature.id)}
              Icon={feature.icon}
              description={feature.description}
              href={
                feature.id === "recipe-generator"
                  ? "/ai-features/generate-recipe"
                  : feature.id === "photo-to-recipe"
                    ? "/ai-features/food-photo"
                    : "#"
              }
              cta={
                comingSoon
                  ? "Coming Soon"
                  : feature.id === "/meal-planner"
                    ? "Open planner"
                    : "Try now"
              }
              onClick={(e) => handleClick(e, feature.id)}
            />
          );
        })}
      </BentoGrid>
    </>
  );
}

export default AIFeaturesGrid;
