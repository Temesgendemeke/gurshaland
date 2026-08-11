"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  published: {
    label: "Published",
    color: "hsl(var(--primary))",
  },
  draft: {
    label: "Draft",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

interface PublishedDraftChartProps {
  recipesPublished: number;
  recipesDraft: number;
  blogsPublished: number;
  blogsDraft: number;
  loading: boolean;
}

export function PublishedDraftChart({
  recipesPublished,
  recipesDraft,
  blogsPublished,
  blogsDraft,
  loading,
}: PublishedDraftChartProps) {
  if (loading) {
    return (
      <Card className="rounded-xl border bg-card overflow-hidden">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Published vs Drafts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
            Loading chart…
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = [
    {
      category: "Recipes",
      published: recipesPublished,
      draft: recipesDraft,
    },
    {
      category: "Blogs",
      published: blogsPublished,
      draft: blogsDraft,
    },
  ];

  const total = data.reduce(
    (sum, row) => sum + row.published + row.draft,
    0,
  );

  if (total === 0) {
    return (
      <Card className="rounded-xl border bg-card overflow-hidden">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Published vs Drafts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
            No posts yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border bg-card overflow-hidden">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          Published vs Drafts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <ChartContainer config={chartConfig} className="aspect-[16/9] max-h-[260px] w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent labelKey="category" />}
            />
            <Bar dataKey="published" fill="var(--color-published)" radius={4} />
            <Bar dataKey="draft" fill="var(--color-draft)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
