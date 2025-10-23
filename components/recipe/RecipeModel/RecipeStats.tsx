import React from 'react'
import { Clock, Users } from 'lucide-react'
import { Badge } from "@/components/ui/badge";


interface Stats {
    cooktime: string,
    servings: number,
    difficulty: string,
}

const RecipeStats = ({stats}: {
    stats: Stats
}) => {
  return (
    <div className="flex  sm:flex-row sm:items-center  text-sm text-body-muted bg-slate-50 dark:bg-slate-800 py-4  rounded-xl">
                      <div className="flex items-center gap-2 min-w-[120px] justify-center">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">{stats.cooktime}min</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-[120px] justify-center">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">
                          {stats.servings} servings
                        </span>
                      </div>
                      <div className="flex items-center gap-2 min-w-[120px] justify-center">
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {stats.difficulty}
                        </Badge>
                      </div>
                    </div>
  )
}

export default RecipeStats