import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatsCardSkeleton } from "@/components/ui/loading-skeleton";

interface StatsCardProps {
  name: string;
  count: number;
  Icon: LucideIcon;
  className?: string;
  loading: Boolean;
  type: "post" | "follower";
  published_posts_count?: number;
  draft_posts_count?: number;
}

const StatsCard = ({
  name,
  count,
  Icon,
  className,
  loading,
  type,
  published_posts_count,
  draft_posts_count,
}: StatsCardProps) => {
  if (loading) {
    return <StatsCardSkeleton className={className} />;
  }

  return (
    <Link
      href={`/dashboard/${name}`}
      aria-label={`${name} stats`}
      className={cn(
        "group relative overflow-hidden rounded-xl border",
        "border-emerald-200/60 dark:border-emerald-800/40",
        "bg-gradient-to-br from-emerald-50/70 via-white to-emerald-100/40",
        "dark:from-gray-900/70 dark:via-gray-900 dark:to-emerald-950/30",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        "p-5 aspect-[5/3]",
        className,
      )}
    >
      {/* soft glow */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
        bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_60%)]"
      />
      {/* decorative gradient bar */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      {/* icon */}
      <div
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg
        bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/15
        ring-1 ring-inset ring-emerald-400/30 dark:ring-emerald-700/40
        transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
      >
        <Icon className="h-5 w-5" />
      </div>
      {/* content */}
      {
        <div className="relative h-full flex flex-col justify-end">
          <div
            className="text-9xl md:text-7xl lg:text-9xl font-extrabold tracking-tight
            bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400
            dark:from-emerald-300 dark:via-emerald-400 dark:to-emerald-500
            bg-clip-text text-transparent drop-shadow-sm select-none"
          >
            {count.toLocaleString()}
          </div>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-emerald-700/70 dark:text-emerald-300/70">
            {name}
          </p>

          {type === "post" && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div
                className="rounded-lg p-3 ring-1 ring-inset
                ring-emerald-400/30 dark:ring-emerald-700/40
                bg-white/60 dark:bg-emerald-950/20
                backdrop-blur-sm transition-colors"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
                  Published
                </div>
                <div className="mt-0.5 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {(published_posts_count ?? 0).toLocaleString()}
                </div>
              </div>

              <div
                className="rounded-lg p-3 ring-1 ring-inset
                ring-amber-400/30 dark:ring-amber-700/40
                bg-white/60 dark:bg-amber-950/10
                backdrop-blur-sm transition-colors"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-800/80 dark:text-amber-300/90">
                  Drafts
                </div>
                <div className="mt-0.5 text-xl font-bold text-amber-800 dark:text-amber-300">
                  {(draft_posts_count ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      }

      {/* bottom accent */}
      <span className="absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-emerald-300/0 via-emerald-400/60 to-emerald-300/0 opacity-40 group-hover:opacity-70 transition" />
    </Link>
  );
};

export default StatsCard;
