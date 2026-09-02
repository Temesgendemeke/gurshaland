"use client";

import { useEffect } from "react";
import { recordView } from "@/actions/viewTracking";

export default function ViewTracker({
  type,
  id,
}: {
  type: "recipe" | "blog";
  id: number | string;
}) {
  useEffect(() => {
    if (!id) return;
    recordView(type, Number(id)).catch(() => {});
  }, [type, id]);

  return null;
}
