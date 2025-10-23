import { Nutrition } from '@/utils/types/recipe'
import React from 'react'

const NutritionSection = ({nutrition}:{nutrition: Nutrition}) => {
  return (
   <div className="space-y-4 mt-4">
                  <h3 className="text-xl font-semibold text-body border-b border-slate-200 dark:border-slate-700 pb-3">
                    Nutrition
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nutrition && (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Calories: {nutrition.calories}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Protein: {nutrition.protein}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Carbs: {nutrition.carbs}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Fat: {nutrition.fat}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-body leading-relaxed">
                            Fiber: {nutrition.fiber}g
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
)
}

export default NutritionSection