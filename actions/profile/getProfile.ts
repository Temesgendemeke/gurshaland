"use server";

import { createClient } from "@/utils/supabase/server";

export const getProfilebyUsername = async (username: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_profile_by_username", {
    _username: username,
  });

  if (error) throw error;

  return data;
};
