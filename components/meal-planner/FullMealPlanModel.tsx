"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Apple,
  BookOpen,
  CheckCheckIcon,
  ChefHat,
  Download,
  NotebookPen,
  SaveIcon,
  ShoppingCart,
  Sparkles,
  Target,
  WeightIcon,
  X,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PlanType } from "@/schema/meal-planner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveMealplan } from "@/actions/meal/crud";
import generate_error from "@/utils/generate_error";
import { useAuth } from "@/store/useAuth";
import CheifNotes from "./CheifNotes";
import { useState } from "react";

const FullMealPlanModel = ({ plan }: { plan: PlanType }) => {
  const router = useRouter();
  const user = useAuth((store) => store.user);
  const handleSave = async () => {
    
    try {
      const mealPlan = {
        ...plan,
        author_id: user?.id,
      };
      await saveMealplan(mealPlan);
      toast.message("Meal plan saved successfully");
      router.push("/meal-planner/my-meal-plans");
    } catch (error) {
      console.log("hrllo")
      console.log(error);
      toast.message(generate_error(error));
    } 
  };

  const [showDescription, setShowDescription] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="relative z-10 flex w-full h-14 md:h-16 items-center justify-center btn-primary-modern text-lg font-semibold shadow-sm"
        >
          <BookOpen className="mr-3 h-5 w-5" />
          <span>View Full Plan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[100vw] sm:max-w-[95vw] lg:max-w-7xl h-screen sm:h-[90vh] p-0 gap-0 bg-background border-none sm:border sm:border-border/40 shadow-sm overflow-hidden flex flex-col sm:rounded-lg ">
        {/* Grain Texture Overlay from Layout */}
        <div className="grain-overlay">
          <svg
            className="grain-svg"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <filter id="grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.7"
                numOctaves="3"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="mono"
              />
              <feComponentTransfer in="mono" result="grainAlpha">
                <feFuncA type="gamma" amplitude="1" exponent="1.4" offset="0" />
              </feComponentTransfer>
              <feComposite in="SourceGraphic" in2="grainAlpha" operator="in" />
            </filter>

            <rect
              className="grain-rect"
              width="100%"
              height="100%"
              filter="url(#grain)"
            />
          </svg>
        </div>
        {/* Header Section - More Spacious */}
        <div className="flex-none px-6 py-6 md:px-10 md:py-8 border-b border-border/40 bg-background z-20">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <DialogTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {plan?.name}
                </DialogTitle>
                <div
                  className={`hidden sm:flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase`}
                >
                  {plan.timeframe === "today" ? "Daily" : "Full Week"}
                </div>
              </div>
              <DialogDescription
                className={`text-lg text-foreground max-w-4xl leading-relaxed cursor-pointer transition-all duration-300 ease-in-out ${
                  isScrolled
                    ? "opacity-0 h-0 overflow-hidden m-0 p-0"
                    : "opacity-100"
                }`}
              >
                {showDescription
                  ? plan.notes?.slice(0, 100) + "..."
                  : plan.notes ||
                    "Your personalized nutrition roadmap, carefully crafted to align with your health goals and dietary preferences."}
              </DialogDescription>
            </div>

            {/* <div className="flex flex-wrap gap-3">
              <div className="flex items-center px-4 py-2 rounded-xl bg-primary/10 border border-primary/40 text-primary">
                <span className="font-medium text-foreground">{plan.diet}</span>
              </div>
              <div className="flex items-center px-4 py-2 rounded-xl bg-primary/10 border border-primary/40 text-primary">
                <span className="font-medium text-foreground">
                  {plan.goal.replace("_", " ")}
                </span>
              </div>
              {plan.calories && (
                <div className="flex items-center px-4 py-2 rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="font-bold">
                    {plan.calories}{" "}
                    <span className="text-primary-foreground/80 font-normal text-sm">
                      kcal/day
                    </span>
                  </span>
                </div>
              )}
            </div> */}
          </div>
        </div>

        {/* Scrollable Content - Open Layout */}
        <div
          className="flex-1 overflow-y-auto relative z-10"
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 xl:grid-cols-12 min-h-full">
              {/* Main Meals Column */}
              <div className="xl:col-span-8 p-6 md:p-10 space-y-12 border-r border-border/40">
                {plan.days.map((day, dayIdx) => (
                  <div key={day.day} className="space-y-6">
                    {/* Day Header */}
                    <div className="flex items-center gap-4 pb-4 border-b-2 border-border/60">
                      <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                        {dayIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-foreground">
                          {day.day}
                        </h3>
                        {day?.totalCalories > 0 && (
                          <p className="text-base font-medium text-muted-foreground mt-0.5">
                            Approx.{" "}
                            <span className="text-foreground font-semibold">
                              {day.totalCalories} kcal
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meal List - Open & Clean */}
                    <div className="space-y-10 pl-2 md:pl-4">
                      {day.meals.map((meal, idx) => (
                        <div
                          key={idx}
                          className="group relative pl-6 border-l-2 border-border/50 hover:border-primary/50 transition-colors duration-300 cursor-pointer"
                        >
                          {/* Timeline Dot */}
                          <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-background bg-border group-hover:bg-primary transition-colors duration-300" />

                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
                              <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 ">
                                {meal.name}
                              </h4>
                              <div className="flex items-start mt-2 sm:mt-0  justify-between gap-3">
                                {/* <Badge
                                  variant="secondary"
                                  className="bg-secondary/40 text-secondary-foreground hover:bg-secondary/60 transition-colors uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 rounded-md"
                                >
                                  {meal.type}
                                </Badge> */}
                                {typeof meal.calories === "number" && (
                                  <span className="font-mono  text-muted-foreground bg-muted font-semibold px-2 py-2 rounded  text-sm hover:text-primary transition-colors flex items-center w-28">
                                    <WeightIcon className="w-4 h-4 mr-2" />
                                    {meal.calories} kcal
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                              {meal.description}
                            </p>

                            {(meal.protein || meal.carbs || meal.fat) && (
                              <div className="flex flex-wrap gap-4 pt-2">
                                {typeof meal.protein === "number" && (
                                  <div className="flex items-baseline gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border text-muted-foreground">
                                    <span className="font-bold">
                                      {meal.protein}g
                                    </span>
                                    <span className="opacity-70 text-xs uppercase font-semibold">
                                      Protein
                                    </span>
                                  </div>
                                )}
                                {typeof meal.carbs === "number" && (
                                  <div className="flex items-baseline gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border text-muted-foreground">
                                    <span className="font-bold">
                                      {meal.carbs}g
                                    </span>
                                    <span className="opacity-70 text-xs uppercase font-semibold">
                                      Carbs
                                    </span>
                                  </div>
                                )}
                                {typeof meal.fat === "number" && (
                                  <div className="flex items-baseline gap-1.5 text-sm  px-3 py-1.5 rounded-lg border border-border text-muted-foreground">
                                    <span className="font-bold">
                                      {meal.fat}g
                                    </span>
                                    <span className="opacity-70 text-xs uppercase font-semibold">
                                      Fat
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {plan?.timeframe === "today" && (
                  <CheifNotes pro_tips={plan?.pro_tips as string[]} />
                )}
              </div>

              {/* Sidebar Column - Clean Dashboard Style */}
              <div className="xl:col-span-4 bg-muted/5 p-4 md:p-4 space-y-10 border-t xl:border-t-0 border-border/40">
                {/* Shopping List */}
                {plan?.shopping_list?.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                      <div className="p-2 rounded-lg text-primary">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        Shopping List
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {plan?.shopping_list.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-4 p-3 rounded-xl bg-card border border-border/40   cursor-default"
                        >
                          <CheckCheckIcon className="w-5 h-5 text-primary" />
                          <span className="text-base text-foreground/90 leading-snug font-medium">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pro Tips */}
                {plan.timeframe === "full-week" && (
                  <CheifNotes pro_tips={plan?.pro_tips as string[]} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-6 border-t border-border/40 bg-background z-20 relative">
          <DialogFooter className="flex-col-reverse sm:flex-row gap-4 sm:gap-3 w-full sm:justify-between items-center">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="w-full sm:w-auto h-12 px-6 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
              >
                Close View
              </Button>
            </DialogClose>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-6 text-base font-semibold border-border/50 bg-background hover:bg-muted/30 rounded-xl shadow-sm"
              >
                <Download className="h-5 w-5 mr-2 opacity-70" />
                Export PDF
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto h-12 px-8 text-base font-bold btn-primary-modern rounded-xl"
                onClick={handleSave}
              >
                <SaveIcon className="h-5 w-5 mr-2" />
                Save to My Plans
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullMealPlanModel;
