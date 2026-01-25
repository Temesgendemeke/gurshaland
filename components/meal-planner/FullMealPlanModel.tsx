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
  ChefHat,
  Download,
  NotebookPen,
  SaveIcon,
  ShoppingCart,
  Sparkles,
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
      toast.message(generate_error(error));
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="relative z-10 flex w-full h-16 items-center justify-center btn-primary-modern"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Open meal plan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-7xl overflow-y-auto max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-8rem)] p-0 m-0">
        <div className="relative">
          <DialogHeader className="sticky top-0 left-0 z-50 bg-background/60 backdrop-blur-xl w-full p-3 sm:p-5">
            <DialogTitle>Personalized Meal Plan</DialogTitle>
            <DialogDescription>
              Your custom weekly meal plan, crafted to match your goals, diet
              preferences, and calorie targets.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4">
            {/* Main Plan */}
            <div className="w-full lg:flex-1 space-y-4 sm:space-y-6 ">
              <Card className="border shadow-xl bg-card/80 backdrop-blur">
                <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      {plan.timeframe === "today" ? "Today" : "Weekend"}
                    </Badge>
                    <Badge variant="outline" className="capitalize px-3 py-1">
                      {plan.goal.replace("_", " ")}
                    </Badge>
                    <Badge variant="secondary" className="capitalize px-3 py-1">
                      {plan.diet}
                    </Badge>
                    {plan.calories && (
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        {plan.calories} kcal/day
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  {plan.notes && (
                    <CardDescription className="text-base">
                      {plan.notes}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-2  bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-25rem)] min-h-[calc(100vh-40rem)] sm:max-h-[calc(100vh-20rem)] overflow-y-auto">
                  {plan.days.map((d, dayIdx) => (
                    <Card
                      key={d.day}
                      className={`
                                                bg-transparent border-none
                                                ${
                                                  plan.days.length % 2 !== 0 &&
                                                  dayIdx ===
                                                    plan.days.length - 1
                                                    ? "md:col-span-2 md:max-w-full"
                                                    : ""
                                                }
                                            `}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                            {dayIdx + 1}
                          </div>
                          {d.day}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {d.meals.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-muted/30 border border-border"
                          >
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="font-bold text-lg mb-1">
                                  {m.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {m.description}
                                </div>
                              </div>
                              {typeof m.calories === "number" && (
                                <Badge className="">{m.calories} kcal</Badge>
                              )}
                            </div>
                            {(m.protein || m.carbs || m.fat) && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {typeof m.protein === "number" && (
                                  <Badge
                                    variant="outline"
                                    className="border-border text-muted-foreground"
                                  >
                                    Protein {m.protein}g
                                  </Badge>
                                )}
                                {typeof m.carbs === "number" && (
                                  <Badge
                                    variant="outline"
                                    className="border-border text-muted-foreground"
                                  >
                                    Carbs {m.carbs}g
                                  </Badge>
                                )}
                                {typeof m.fat === "number" && (
                                  <Badge
                                    variant="outline"
                                    className="border-border text-muted-foreground"
                                  >
                                    Fat {m.fat}g
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {typeof d.totalCalories === "number" && (
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center justify-between font-semibold">
                              <span>Day Total</span>
                              <Badge className="bg-primary text-primary-foreground">
                                {d.totalCalories} kcal
                              </Badge>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-4 sm:space-y-6">
              {/* Shopping List */}
              {plan.shopping_list?.length ? (
                <Card className="border shadow-xl bg-card/80 backdrop-blur">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary">
                        <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                      </div>
                      Shopping List
                    </CardTitle>
                    <CardDescription>
                      Everything you need for your plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[calc(100vh-40rem)] overflow-y-auto">
                    <ul className="space-y-2">
                      {plan.shopping_list.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              {/* Tips Card */}
              {plan.pro_tips && plan.pro_tips.length > 0 && (
                <Card className="border shadow-xl bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[calc(100vh-39rem)] overflow-y-auto">
                    {plan.pro_tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <NotebookPen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <ReactMarkdown>{tip}</ReactMarkdown>{" "}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 left-0 z-50 bg-background/60 backdrop-blur-xl w-full p-3 sm:p-4 flex-col-reverse sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>Cancel</span>
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="btn-secondary-modern w-full sm:w-auto"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Download PDF</span>
            </Button>
            <Button
              type="submit"
              className="btn-primary-modern w-full sm:w-auto"
              onClick={handleSave}
            >
              <SaveIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Save changes</span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullMealPlanModel;
