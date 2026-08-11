import { GetMealPannerTyp } from "@/schema/meal-planner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CalendarDays, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteMealAlertDialog from "./DeleteMealAlertDialog";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";
import { deleteMealplan } from "@/actions/meal/crud";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/useAuth";

const MealPlanCard = ({ plan }: { plan: GetMealPannerTyp }) => {
  const queryClient = useQueryClient();
  const user = useAuth((store) => store.user);

  const deleteMealPlan = async () => {
    try {
      await deleteMealplan(plan.id);
      await queryClient.invalidateQueries({
        queryKey: ["meal-plans", user?.id],
      });
      toast.success("Meal plan deleted successfully");
    } catch (error) {
      console.log(error);
      await queryClient.invalidateQueries({
        queryKey: ["meal-plans", user?.id],
      });
      toast.error(generate_error(error));
    }
  };

  const meta = [plan.goal, plan.diet].filter(Boolean).join(" · ");

  return (
    <Card className="group flex h-full flex-col bg-card transition-colors hover:border-primary/40">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="line-clamp-1 text-lg font-bold transition-colors group-hover:text-primary">
              {plan.name}
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {plan.timeframe} Plan
            </CardDescription>
          </div>
          {plan.calories && (
            <Badge variant="secondary" className="shrink-0 font-mono">
              {plan.calories} kcal
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="grow space-y-3">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary" />
            {plan.days?.length || 0} days
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-primary" />
            {plan.meals_per_day} meals/day
          </span>
        </div>
        {meta && (
          <p className="line-clamp-1 text-sm text-muted-foreground">{meta}</p>
        )}
      </CardContent>

      <CardFooter className="gap-3 pt-0">
        <Button asChild variant="outline" className="flex-1">
          <Link
            href={`/meal-planner/my-meal-plans/${plan.id}`}
            className="inline-flex items-center justify-center gap-2"
          >
            View Plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <DeleteMealAlertDialog onConfirm={deleteMealPlan} />
      </CardFooter>
    </Card>
  );
};

export default MealPlanCard;
