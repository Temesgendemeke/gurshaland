"use client";
import React, { useEffect, useState } from "react";
import FollowerColumn from "@/components/dashboard/FollowerColumn";
import { FollowerColumnType } from "@/utils/types/Dashboard";
import { DataTable } from "@/components/data-table";
import { get_followers } from "@/actions/followers/follower";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";

type FollowerRow = FollowerColumnType & { slug: string };

export default function FollowersPage() {
  const [followers, setFollowers] = useState<FollowerRow[]>([]);
  const userId = useAuth((store) => store.user?.id);
  const [loading, setLoading] = useState(true);

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
          setFollowers(
            data.map((f: FollowerColumnType) => ({ ...f, slug: f.id })),
          );
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setLoading(false);
          toast.error(generate_error(error));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Followers
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track engagement and manage your community.
        </p>
      </div>

      <DataTable<FollowerRow, any>
        columns={FollowerColumn as any}
        data={followers}
        loading={loading}
      />
    </div>
  );
}
