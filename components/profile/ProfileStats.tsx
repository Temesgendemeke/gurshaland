"use client";

import { useEffect } from "react";
import { useProfileStats } from "@/store/ProfileStats";
import { Profile } from "@/utils/types/profile";

const ProfileStats = ({ profile }: { profile: Profile }) => {
  const followers = useProfileStats((store) => store.followers);
  const init = useProfileStats((store) => store.init);

  useEffect(() => {
    init(profile.followers ?? 0, profile.is_following ?? false);
  }, [profile, init]);

  const info_list = [
    { field: "Following", count: profile.following.length },
    { field: "Followers", count: followers },
    { field: "Recipes", count: profile.recipes.length },
    { field: "Blogs", count: profile.blogs?.length ?? 0 },
  ];

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-5 border-t border-border/60 pt-6 sm:gap-8 md:gap-12 md:justify-end md:border-t-0 md:pt-0">
      {info_list.map((info) => (
        <div
          className="flex flex-col items-center md:items-end"
          key={info.field}
        >
          <span className="font-gosh text-2xl font-bold leading-none tracking-tight tabular-nums text-foreground sm:text-3xl">
            {info.count}
          </span>
          <span className="mt-1.5 text-sm text-muted-foreground">
            {info.field}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
