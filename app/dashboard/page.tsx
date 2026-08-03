"use client";
import { getStatus } from "@/actions/dashboard/stats";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import StatsCard from "@/components/StatsCard";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/store/useAuth";
import { Post } from "@/utils/types/Dashboard";
import { Send, User2, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";

interface Status {
  followers_count: number;
  recipes: Post[];
  blogs: Post[];
  recipes_draft_count: number;
  recipes_published_count: number;
  blogs_draft_count: number;
  blogs_published_count: number;
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
  });
  const [loading, setLoading] = useState(true);
  const user = useAuth((store) => store.user);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!user?.id) return;
      setLoading(true);
      const data = await getStatus(user.id as string);
      if (cancelled) return;
      setStatus(data);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back! Here’s what’s happening.
          </p>
        </div>

        <Separator className="opacity-60" />

        <div className="grid gap-4 md:grid-cols-3">
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

      <div className="grid gap-6 xl:grid-cols-2">
        <SimpleTable data={status.recipes} name="Recipe" loading={loading} />
        <SimpleTable data={status.blogs} name="Blog" loading={loading} />
      </div>
    </div>
  );
}
