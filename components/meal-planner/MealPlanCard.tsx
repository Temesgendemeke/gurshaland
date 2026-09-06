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
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-none transition-colors hover:border-primary/40">
      <div className="border-b border-border/60 p-4 sm:p-5">
        <h3 className="line-clamp-1 text-base sm:text-lg font-bold tracking-tight text-foreground font-gosh">
          {plan.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground capitalize">
          {plan.timeframe} plan
        </p>
      </div>

      <div className="flex grow flex-col gap-2 p-4 sm:p-5">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {plan.days?.length || 0} days · {plan.meals_per_day} meals/day
          {plan.calories ? ` · ~${plan.calories} kcal` : ""}
        </p>
        {meta && (
          <p className="line-clamp-1 text-xs text-muted-foreground/80 capitalize">{meta}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5 border-t border-border/60 p-3.5 sm:p-4">
        <Button asChild variant="outline" size="sm" className="flex-1 h-8 sm:h-9 text-xs font-semibold shadow-none">
          <Link
            href={`/meal-planner/my-meal-plans/${plan.id}`}
            className="inline-flex items-center justify-center gap-1.5"
          >
            <span>View Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <DeleteMealAlertDialog onConfirm={deleteMealPlan} />
      </div>
    </div>
  );
};

export default MealPlanCard;
