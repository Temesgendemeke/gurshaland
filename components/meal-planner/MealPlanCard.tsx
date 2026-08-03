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
import {
  ArrowRight,
  CalendarDays,
  Flame,
  Target,
  Utensils,
} from "lucide-react";
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
      // Delete from database
      await deleteMealplan(plan.id);

      // Invalidate and refetch the meal plans query
      await queryClient.invalidateQueries({
        queryKey: ["meal-plans", user?.id],
      });

      toast.success("Meal plan deleted successfully");
    } catch (error) {
      console.log(error);

      // If deletion fails, refetch to restore the UI state
      await queryClient.invalidateQueries({
        queryKey: ["meal-plans", user?.id],
      });

      toast.error(generate_error(error));
    }
  };
  return (
    <Card
      key={plan.id}
      className="modern-card modern-card-hover group relative flex flex-col h-full overflow-hidden border-border/50 bg-card/70"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
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

      <CardContent className="grow space-y-6">
        <div className="flex flex-wrap gap-2">
          {plan.goal && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-primary/10 border-primary/25 text-primary"
            >
              <Target className="w-3 h-3" />
              {plan.goal}
            </Badge>
          )}
          {plan.diet && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-muted/40 border-border/60 text-foreground/80"
            >
              <Utensils className="w-3 h-3" />
              {plan.diet}
            </Badge>
          )}
        </div>

        <div className="flex gap-6 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/40">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-primary/70" />
            <span>{plan.days?.length || 0} Days</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-primary/80" />
            <span>{plan.meals_per_day} Meals/day</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex w-full gap-3">
          <DeleteMealAlertDialog onConfirm={deleteMealPlan} />
          <Button
            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm hover:shadow-md"
            variant="outline"
            asChild
          >
            <Link
              href={`/meal-planner/my-meal-plans/${plan.id}`}
              className="flex items-center justify-center gap-2"
            >
              View Plan{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MealPlanCard;
