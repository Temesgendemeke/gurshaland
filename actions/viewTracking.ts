"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

const IP_RE = /^(?:\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]+$/;

async function getRequestIp(): Promise<string | null> {
  const h = await headers();
  const candidate =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip");
  if (candidate && IP_RE.test(candidate)) return candidate;
  return null;
}

export async function recordView(
  contentType: "recipe" | "blog",
  contentId: number,
) {
  if (!contentId) return;

  const supabase = await createClient();
  const ip = await getRequestIp();

  const { error } = await supabase.rpc(
    contentType === "recipe" ? "record_recipe_view" : "record_blog_view",
    contentType === "recipe"
      ? { _recipe_id: contentId, _ip_address: ip }
      : { _blog_id: contentId, _ip_address: ip },
  );

  if (error) {
    console.error(`Error recording ${contentType} view:`, error.message);
  }
}
