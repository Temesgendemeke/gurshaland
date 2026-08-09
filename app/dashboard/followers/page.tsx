"use client";
import React, { useEffect, useMemo, useState } from "react";
import FollowerColumn from "@/components/dashboard/FollowerColumn";
import { FollowerColumnType } from "@/utils/types/Dashboard";
import { DataTable } from "@/components/data-table";
import { get_followers } from "@/actions/followers/follower";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";
import StatsCard from "@/components/StatsCard";
import { Separator } from "@/components/ui/separator";
import { Heart, Send, UserPlus, Users } from "lucide-react";

export default function FollowersPage() {
  const [followers, setFollowers] = useState<FollowerColumnType[]>([]);
  const userId = useAuth((store) => store.user?.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!userId) {
          if (!cancelled) {
            setFollowers([]);
            setLoading(false);
          }
          return;
        }

        const data = await get_followers(userId);
        if (!cancelled) {
          setFollowers(data ?? []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          setError(generate_error(err));
          toast.error(generate_error(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const totalFollowers = followers.length;

  const newThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return followers.filter((f) => {
      const date = new Date(f.followed_since).getTime();
      return !Number.isNaN(date) && date >= weekAgo;
    }).length;
  }, [followers]);

  const totalLikes = useMemo(
    () => followers.reduce((sum, f) => sum + (Number(f.like) || 0), 0),
    [followers],
  );

  const totalComments = useMemo(
    () => followers.reduce((sum, f) => sum + (Number(f.comments) || 0), 0),
    [followers],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-gosh tracking-tight text-foreground">
              Followers
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track engagement and manage your community.
            </p>
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            name={"followers"}
            count={totalFollowers}
            Icon={Users}
            loading={loading}
            type="follower"
            href="/dashboard/followers"
          />
          <StatsCard
            name={"new this week"}
            count={newThisWeek}
            Icon={UserPlus}
            loading={loading}
            type="follower"
            href="/dashboard/followers"
          />
          <StatsCard
            name={"likes"}
            count={totalLikes}
            Icon={Heart}
            loading={loading}
            type="follower"
            href="/dashboard/followers"
          />
          <StatsCard
            name={"comments"}
            count={totalComments}
            Icon={Send}
            loading={loading}
            type="follower"
            href="/dashboard/followers"
          />
        </div>
      </div>

      <DataTable<FollowerColumnType, any>
        columns={FollowerColumn as any}
        data={followers}
        loading={loading}
      />
    </div>
  );
}
