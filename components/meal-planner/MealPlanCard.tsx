import { GetMealPannerTyp } from "@/schema/meal-planner";
import { ArrowRight } from "lucide-react";
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
    <div className="flex h-full flex-col rounded-xl border border-border/80 bg-card">
      <div className="border-b border-border/80 p-5">
        <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-foreground">
          {plan.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {plan.timeframe} plan
        </p>
      </div>

      <div className="flex grow flex-col gap-2 p-5">
        <p className="text-sm text-muted-foreground">
          {plan.days?.length || 0} days · {plan.meals_per_day} meals/day
          {plan.calories ? ` · ${plan.calories} kcal` : ""}
        </p>
        {meta && (
          <p className="line-clamp-1 text-sm text-muted-foreground">{meta}</p>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-border/80 p-4">
        <Button asChild variant="outline" className="flex-1">
          <Link
            href={`/meal-planner/my-meal-plans/${plan.id}`}
            className="inline-flex items-center justify-center gap-2"
          >
            View Plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <DeleteMealAlertDialog onConfirm={deleteMealPlan} />
      </div>
    </div>
  );
};

export default MealPlanCard;
