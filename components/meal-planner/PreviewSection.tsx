"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Apple, ChefHat, ShoppingCart, Sparkles, Zap } from "lucide-react"
import { MealPlannerFormType } from "@/schema/meal-planner"

const PreviewSection = ({ plan }: { plan: MealPlannerFormType }) => {
    return (
        <div className="grid gap-8 max-h-[calc(100vh-10rem)] overflow-hidden">
            {/* Main Plan */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-2 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                    <CardHeader className="pb-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1">
                                {plan.timeframe === "today" ? "Today" : "Weekend"}
                            </Badge>
                            <Badge variant="outline" className="capitalize px-3 py-1">
                                {plan.goal.replace("_", " ")}
                            </Badge>
                            <Badge variant="secondary" className="capitalize px-3 py-1">
                                {plan.diet}
                            </Badge>
                            {plan.calories && (
                                <Badge className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-3 py-1">
                                    {plan.calories} kcal/day
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                        {plan.notes && (
                            <CardDescription className="text-base">{plan.notes}</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4 p-0 bg-transparent">
                        {plan.days.map((d, dayIdx) => (
                            <Card
                                key={d.day}
                                className="bg-transparent border-none"
                            >
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
                                            {dayIdx + 1}
                                        </div>
                                        {d.day}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {d.meals.map((m, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-sky-50/50 dark:from-gray-800/50 dark:to-gray-800/50 border border-emerald-200/50 dark:border-emerald-800/50"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex-1">
                                                    <div className="font-bold text-lg mb-1">{m.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {m.description}
                                                    </div>
                                                </div>
                                                {typeof m.calories === "number" && (
                                                    <Badge className="">
                                                        {m.calories} kcal
                                                    </Badge>
                                                )}
                                            </div>
                                            {(m.protein || m.carbs || m.fat) && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {typeof m.protein === "number" && (
                                                        <Badge variant="outline" className="border-blue-300 text-blue-700 dark:text-blue-400">
                                                            Protein {m.protein}g
                                                        </Badge>
                                                    )}
                                                    {typeof m.carbs === "number" && (
                                                        <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-400">
                                                            Carbs {m.carbs}g
                                                        </Badge>
                                                    )}
                                                    {typeof m.fat === "number" && (
                                                        <Badge variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-400">
                                                            Fat {m.fat}g
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {typeof d.totalCalories === "number" && (
                                        <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800">
                                            <div className="flex items-center justify-between font-semibold">
                                                <span>Day Total</span>
                                                <Badge className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
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
                    <Card className="border-2 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-4">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500">
                                    <ShoppingCart className="h-5 w-5 text-white" />
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
                                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="h-2 w-2 rounded-full bg-emerald-600" />
                                        </div>
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ) : null}

                {/* Tips Card */}
                <Card className="border-2 shadow-xl bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-gray-900 dark:to-gray-900">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-emerald-600" />
                            Pro Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
                            <ChefHat className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Prep proteins in bulk to save time during the week</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
                            <Apple className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Keep healthy snacks aligned with your goal</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
                            <Zap className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                            <p className="text-sm">Stay hydrated throughout the day for best results</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default PreviewSection;