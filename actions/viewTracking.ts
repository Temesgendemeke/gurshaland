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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ip = await getRequestIp();

  const { error } = await supabase.rpc(
    contentType === "recipe" ? "record_recipe_view" : "record_blog_view",
    contentType === "recipe"
      ? { _recipe_id: contentId, _viewer_id: user?.id ?? null, _ip_address: ip }
      : { _blog_id: contentId, _viewer_id: user?.id ?? null, _ip_address: ip },
  );

  if (error) {
    // Direct insert fallback
    const table = contentType === "recipe" ? "recipe_view" : "blog_view";
    const idKey = contentType === "recipe" ? "recipe_id" : "blog_id";
    await supabase
      .from(table)
      .insert({
        [idKey]: contentId,
        viewer_id: user?.id ?? null,
        ip_address: ip,
      })
      .catch(() => {});
  }
}
