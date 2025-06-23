import { Card } from "./ui/card";
import stats from "@/constants/stats";

type Stat = typeof stats[number];

function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat) => (
        <Card key={stat.label} className="modern-card p-6 text-center">
          <div className={`text-3xl font-bold ${stat.color} mb-2`}>
            {stat.value}
          </div>
          <div className="text-body-muted">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}

export default StatsSection;
