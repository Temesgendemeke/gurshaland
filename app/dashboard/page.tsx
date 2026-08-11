"use client";
import { getStatus } from "@/actions/dashboard/stats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import { TopPostsTabs } from "@/components/dashboard/TopPostsTabs";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/store/useAuth";
import { Post } from "@/utils/types/Dashboard";
import { Plus, Send, User2, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ActivityItem {
  type: "recipe_comment" | "blog_comment" | "follower";
  title: string | null;
  text: string | null;
  actor: string;
  created_at: string;
}

interface Status {
  followers_count: number;
  recipes: Post[];
  blogs: Post[];
  recipes_draft_count: number;
  recipes_published_count: number;
  blogs_draft_count: number;
  blogs_published_count: number;
  recent_activity?: ActivityItem[];
}

export default function Page() {
  const [status, setStatus] = useState<Status>({
    followers_count: 0,
    recipes: [],
    blogs: [],
    recipes_draft_count: 0,
    recipes_published_count: 0,
    blogs_draft_count: 0,
    blogs_published_count: 0,
    recent_activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const user = useAuth((store) => store.user);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getStatus(user.id as string);
        if (cancelled) return;
        setStatus(data);
        setLastUpdated(new Date());
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-gosh">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              A snapshot of your recipes, blogs, and followers.
            </p>
            {lastUpdated && (
              <p className="mt-1 text-xs text-muted-foreground/70">
                Last updated{" "}
                {lastUpdated.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog/create">
                <Plus className="h-4 w-4" />
                New Blog
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/recipes/create">
                <Plus className="h-4 w-4" />
                New Recipe
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="opacity-60" />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error} Showing cached values if available.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatsCard
            name={"followers"}
            count={status.followers_count}
            Icon={User2}
            loading={loading}
            type="follower"
          />
          <StatsCard
            name={"recipes"}
            count={status.recipes_published_count + status.recipes_draft_count}
            Icon={UtensilsCrossed}
            loading={loading}
            type="post"
            published_posts_count={status.recipes_published_count}
            draft_posts_count={status.recipes_draft_count}
          />
          <StatsCard
            name={"blogs"}
            count={status.blogs_published_count + status.blogs_draft_count}
            Icon={Send}
            loading={loading}
            type="post"
            published_posts_count={status.blogs_published_count}
            draft_posts_count={status.blogs_draft_count}
          />
        </div>
      </div>

      <TopPostsTabs
        recipes={status.recipes}
        blogs={status.blogs}
        loading={loading}
      />

      <RecentActivity items={status.recent_activity ?? []} loading={loading} />
    </div>
  );
}
