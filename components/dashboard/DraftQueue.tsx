"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, Send, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DraftQueueProps {
  recipesDraft: number;
  blogsDraft: number;
  loading: boolean;
}

export function DraftQueue({
  recipesDraft,
  blogsDraft,
  loading,
}: DraftQueueProps) {
  const rows = [
    {
      label: "Recipe drafts",
      count: recipesDraft,
      href: "/dashboard/recipes",
      Icon: UtensilsCrossed,
    },
    {
      label: "Blog drafts",
      count: blogsDraft,
      href: "/dashboard/blogs",
      Icon: Send,
    },
  ];

  const totalDrafts = recipesDraft + blogsDraft;

  return (
    <Card className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
      <CardHeader className="border-b px-5 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <FileEdit className="h-4 w-4 text-muted-foreground" />
            Draft Queue
          </CardTitle>
          {!loading && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              {totalDrafts} pending
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-14 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-14 animate-pulse rounded-lg bg-muted/60" />
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map(({ label, count, href, Icon }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "group flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3 transition-colors",
                  count > 0
                    ? "hover:border-primary/50 hover:bg-accent/5"
                    : "opacity-60",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {count.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground group-hover:hidden">
                    to publish
                  </span>
                  <span className="hidden text-xs font-medium text-primary group-hover:inline">
                    Review →
                  </span>
                </div>
              </Link>
            ))}
            {totalDrafts === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nothing waiting — you’re all caught up.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
