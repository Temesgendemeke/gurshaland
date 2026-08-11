"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, ShoppingCart, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { mealPlannerType } from "@/schema/meal-planner";

const PreviewSection = ({ plan }: { plan: mealPlannerType }) => {
  return (
    <div className="grid gap-8 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {/* Main Plan */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border bg-card">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                {plan.timeframe === "today" ? "Today" : "Full Week"}
              </Badge>
              <Badge variant="outline" className="capitalize px-3 py-1">
                {plan.goal.replace("_", " ")}
              </Badge>
              <Badge variant="secondary" className="capitalize px-3 py-1">
                {plan.diet}
              </Badge>
              {plan.calories && (
                <Badge variant="outline" className="px-3 py-1">
                  {plan.calories} kcal/day
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {plan.name ?? "Your Meal Plan"}
            </CardTitle>
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
                          <Badge variant="outline" className="border-border">
                            {m.calories} kcal
                          </Badge>
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
                        <Badge variant="outline" className="border-border">
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
      <div className="space-y-6 w-full">
        {/* Shopping List */}
        {plan.shopping_list?.length ? (
          <Card className="border bg-card sticky top-4">
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
        {plan.pro_tips?.length ? (
          <Card className="border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.pro_tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <ChefHat className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed [&_p]:m-0">
                    <ReactMarkdown>{tip}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default PreviewSection;
