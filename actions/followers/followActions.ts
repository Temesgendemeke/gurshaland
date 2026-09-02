"use server";

import { createClient } from "@/utils/supabase/server";

export const followProfile = async (profileId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("follow_profile", {
    _profile_id: profileId,
  });
  if (error) throw error;
};

export const unfollowProfile = async (profileId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("unfollow_profile", {
    _profile_id: profileId,
  });
  if (error) throw error;
};
