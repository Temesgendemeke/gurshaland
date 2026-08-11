"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, UserPlus } from "lucide-react";

export interface ActivityItem {
  type: "recipe_comment" | "blog_comment" | "follower";
  title: string | null;
  text: string | null;
  actor: string;
  created_at: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
  loading: boolean;
}

function timeAgo(iso: string | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export function RecentActivity({ items, loading }: RecentActivityProps) {
  return (
    <Card className="rounded-xl border bg-card overflow-hidden">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-12 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-12 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-12 animate-pulse rounded-lg bg-muted/60" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No recent activity yet.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.slice(0, 8).map((item, i) => (
              <li key={`${item.type}-${item.created_at}-${i}`} className="py-3">
                <div className="flex items-start gap-3">
                  <span
                    className={
                      item.type === "follower"
                        ? "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                        : "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                    }
                  >
                    {item.type === "follower" ? (
                      <UserPlus className="h-4 w-4" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">
                      {item.type === "follower" ? (
                        <>
                          <span className="font-medium">{item.actor}</span>{" "}
                          started following you
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{item.actor}</span>{" "}
                          commented on{" "}
                          <span className="font-medium">“{item.title}”</span>
                        </>
                      )}
                    </p>
                    {item.text && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {item.text}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground/70">
                    {timeAgo(item.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
