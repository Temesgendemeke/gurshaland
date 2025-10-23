import React from 'react'
import { Ingredient } from '@/utils/types/recipe' 

const IngredientsSection = ({ingredients}: {ingredients: Ingredient[]}) => {
  return (
    <div className="space-y-4 mt-4">
                      <h3 className="text-xl font-semibold text-body border-b border-slate-200 dark:border-slate-700 pb-3">
                        Ingredients
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {ingredients?.map(
                          (
                            ingredient,
                            idx: number
                          ) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                            >
                              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                              <span className="text-sm text-body leading-relaxed">
                                {ingredient.amount} {ingredient.unit}{" "}
                                {ingredient.item}
                              </span>
                            </div>
                          )
                        )}
                      </div>
     </div>
    
  )
}


export default IngredientsSection