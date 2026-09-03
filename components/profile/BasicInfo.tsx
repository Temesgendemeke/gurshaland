"use client";
import React, { useEffect, useState } from "react";
import avatar from "@/public/avater.webp";
import { Button } from "../ui/button";
import { useAuth } from "@/store/useAuth";
import { Profile } from "@/utils/types/profile";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProfileStats } from "@/store/ProfileStats";
import {
  followProfile,
  unfollowProfile,
} from "@/actions/followers/followActions";

interface BasicInfoProps {
  profile: Profile;
}

const BasicInfo = ({ profile }: BasicInfoProps) => {
  const user = useAuth((store) => store.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isFollowing = useProfileStats((store) => store.isFollowing);
  const setFollowing = useProfileStats((store) => store.setFollowing);
  const init = useProfileStats((store) => store.init);

  useEffect(() => {
    init(profile.followers ?? 0, profile.is_following ?? false);
  }, [profile, init]);

  const isOwnProfile = user?.id === profile.id;

  const handleFollow = async () => {
    if (!user) return router.push("/login");
    if (loading) return;

    const next = !isFollowing;
    setFollowing(next);
    setLoading(true);
    try {
      if (next) await followProfile(profile.id);
      else await unfollowProfile(profile.id);
    } catch {
      setFollowing(!next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-7 sm:text-left">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border/70 bg-muted shadow-sm sm:h-32 sm:w-32">
        <Image
          src={profile.avatar_url || avatar.src}
          alt={`${profile.username} avatar`}
          fill
          sizes="128px"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-center sm:items-start">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
          <h1 className="font-gosh text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {profile.full_name || profile.username}
          </h1>
          {!isOwnProfile && (
            <Button
              onClick={handleFollow}
              disabled={loading}
              variant={isFollowing ? "outline" : "default"}
              className="rounded-full px-5 font-semibold"
            >
              {loading ? "..." : isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        <p className="mt-1.5 text-sm font-medium text-muted-foreground">
          @{profile.username}
        </p>

        {profile.bio && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/75">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;
