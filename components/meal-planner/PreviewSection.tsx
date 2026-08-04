"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, ChefHat, ShoppingCart, Sparkles, Zap } from "lucide-react";
import { MealPlannerFormType } from "@/schema/meal-planner";

const PreviewSection = ({ plan }: { plan: MealPlannerFormType }) => {
  return (
    <div className="grid gap-8 max-h-[calc(100vh-10rem)] overflow-hidden">
      {/* Main Plan */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border shadow-sm bg-card">
          <CardHeader className="pb-4">
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
            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            {plan.notes && (
              <CardDescription className="text-base">
                {plan.notes}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4 p-0 bg-transparent">
            {plan.days.map((d, dayIdx) => (
              <Card key={d.day} className="bg-transparent border-none">
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
                          <div className="font-bold text-lg mb-1">{m.name}</div>
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
      <div className="space-y-6 w-full ">
        {/* Shopping List */}
        {plan.shoppingList?.length ? (
          <Card className="border shadow-sm bg-card sticky top-4">
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
            <CardContent>
              <ul className="space-y-2">
                {plan.shoppingList.map((item, idx) => (
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
        <Card className="border shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <ChefHat className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">
                Prep proteins in bulk to save time during the week
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Apple className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">
                Keep healthy snacks aligned with your goal
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">
                Stay hydrated throughout the day for best results
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreviewSection;
