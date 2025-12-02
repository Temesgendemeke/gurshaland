"use client"

import { getMealplanById } from "@/actions/meal/crud"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ShoppingCart, Sparkles, NotebookPen, Info, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import MealPlanSkeleton from "../skeleton/MealPlanSkeleton"

const MealPlanView = ({ id }: { id: string }) => {
    const { data: plan, isLoading } = useQuery({
        queryKey: ['meal-plan', id],
        queryFn: () => getMealplanById(id)
    })

    if (isLoading) {
        return <MealPlanSkeleton />
    }

    if (!plan) {
        return <div className="text-center py-20 text-muted-foreground">Meal plan not found.</div>
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
            {/* Header / Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted">
                        <Link href="/meal-planner/my-meal-plans">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {plan.name}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2 text-sm sm:text-base">
                            <span className="capitalize font-medium text-primary">{plan.goal?.replace('_', ' ')}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                            <span className="capitalize">{plan.timeframe} Plan</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="default" size="sm" className="gap-2 w-full md:w-auto">
                        <Download className="w-4 h-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Badges & Quick Info */}
            <div className="flex flex-wrap gap-3">
                {plan.diet && (
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                        {plan.diet}
                    </Badge>
                )}
                {plan.calories && (
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        {plan.calories} kcal/day
                    </Badge>
                )}
                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                    {plan.meals_per_day} Meals / Day
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                    {plan.days?.length || 0} Days Total
                </Badge>
            </div>

            {plan.notes && (
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm text-muted-foreground flex gap-3 items-start">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-foreground mb-1">Notes</p>
                        {plan.notes}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content: Days & Meals */}
                <div className="flex-1 space-y-8">
                    {plan.days?.map((day: any, index: number) => (
                        <Card key={day.id} className="overflow-hidden border-2 shadow-sm bg-card/50 backdrop-blur-sm">
                            <CardHeader className="bg-muted/30 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                                            {index + 1}
                                        </div>
                                        <span className="capitalize">{day.day}</span>
                                    </CardTitle>
                                    {day.total_calories > 0 && (
                                        <Badge variant="secondary" className="font-mono text-sm">
                                            Total: {day.total_calories} kcal
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {day.meals?.map((meal: any, mIdx: number) => (
                                    <div key={meal.id} className="relative pl-6 border-l-2 border-border/60 hover:border-primary/50 transition-colors group">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors ring-4 ring-background" />

                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-bold text-lg text-foreground/90 group-hover:text-primary transition-colors">
                                                        {meal.name}
                                                    </h4>
                                                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                                                        {meal.description}
                                                    </p>
                                                </div>
                                                {meal.calories && (
                                                    <Badge variant="outline" className="shrink-0 font-mono bg-background">
                                                        {meal.calories} kcal
                                                    </Badge>
                                                )}
                                            </div>

                                            {(meal.protein || meal.carbs || meal.fat) && (
                                                <div className="flex flex-wrap gap-2 text-xs sm:text-sm pt-1">
                                                    {meal.protein && (
                                                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium">
                                                            Protein: {meal.protein}g
                                                        </span>
                                                    )}
                                                    {meal.carbs && (
                                                        <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 font-medium">
                                                            Carbs: {meal.carbs}g
                                                        </span>
                                                    )}
                                                    {meal.fat && (
                                                        <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300 font-medium">
                                                            Fat: {meal.fat}g
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {mIdx !== day.meals.length - 1 && <Separator className="mt-6 opacity-50" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sidebar: Shopping List & Tips */}
                <div className="w-full lg:w-96 space-y-6">
                    {/* Shopping List */}
                    {plan.shopping_list && plan.shopping_list.length > 0 && (
                        <Card className="border-2 shadow-md bg-card ">
                            <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30">
                                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    Shopping List
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-3">
                                    {plan.shopping_list.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-emerald-600 transition-colors" />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pro Tips */}
                    {plan.pro_tips && plan.pro_tips.length > 0 && (
                        <Card className="border-2 shadow-md bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border-amber-200/50 dark:border-amber-800/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                    <Sparkles className="w-5 h-5" />
                                    Pro Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {plan.pro_tips.map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-3 bg-background/60 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                        <NotebookPen className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                                        <div className="text-sm text-muted-foreground">
                                            <ReactMarkdown>{tip}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}



export default MealPlanView