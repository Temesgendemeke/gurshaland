import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Post } from "@/utils/types/Dashboard";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Eye } from "lucide-react";
import React from "react";
import TableSkeleton from "../skeleton/TableSkeleton";

interface SimpleTableProps {
  data: Post[];
  name: string;
  loading: Boolean;
}

export function SimpleTable({ data, name, loading }: SimpleTableProps) {
  const top = data.slice(0, 10);

  // Calculate engagement-to-view ratio for each post
  const postsWithEngagement = top.map((post) => {
    const views = Number(post.view_count) || 0;
    const likes = Number(post.like) || 0;
    const comments = Number(post.comment_count) || 0;

    // Engagement = likes + comments
    const engagement = likes + comments;

    // Engagement-to-view ratio (avoid division by zero)
    const engagementRatio = views > 0 ? engagement / views : 0;

    return {
      ...post,
      views,
      engagement,
      engagementRatio,
    };
  });

  // Find the highest engagement ratio for scaling
  const maxEngagementRatio =
    postsWithEngagement.length > 0
      ? Math.max(...postsWithEngagement.map((p) => p.engagementRatio))
      : 1;

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="rounded-xl border bg-card/50 backdrop- shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="text-base font-semibold tracking-tight">
          Top 10 {name} Posts
        </h3>
        <span className="text-xs text-muted-foreground">
          Updated {new Date().toLocaleDateString()}
        </span>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-40">Views</TableHead>
              <TableHead className="w-24 text-right pr-6">Eng.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postsWithEngagement.map((post, i) => {
              const views = post.views;
              const engagementRatio = post.engagementRatio;

              // Calculate percentage based on engagement-to-view ratio
              const pct =
                maxEngagementRatio > 0
                  ? Math.min(
                      100,
                      Math.round((engagementRatio / maxEngagementRatio) * 100)
                    )
                  : 0;

              return (
                <TableRow
                  key={post.id?.toString() ?? i}
                  className={cn(
                    "group transition-colors hover:bg-muted/40",
                    i < 3 &&
                      "bg-gradient-to-r from-emerald-50/60 dark:from-emerald-900/10"
                  )}
                >
                  <TableCell className="text-center font-medium">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs",
                        i === 0
                          ? "bg-emerald-600 text-white"
                          : i === 1
                          ? "bg-emerald-500/80 text-white"
                          : i === 2
                          ? "bg-emerald-400/70 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-start gap-2 pr-4">
                      <div className="min-w-0">
                        <p className="font-medium leading-snug line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {post.slug?.replace(/-/g, " ")}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-70 transition" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Eye className="h-3 w-3" />
                          {isNaN(views) ? "0" : views.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {isNaN(pct) ? "0%" : `${pct}%`}
                        </span>
                        <span className="text-[8px] text-muted-foreground/70">
                          {engagementRatio.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 rounded bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-r bg-emerald-500 transition-all",
                            pct < 15 && "bg-emerald-300",
                            pct > 70 && "bg-emerald-600"
                          )}
                          style={{ width: `${isNaN(pct) ? "0%" : `${pct}%`}` }}
                          title={`Engagement: ${
                            post.engagement
                          } | Ratio: ${engagementRatio.toFixed(2)}`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="text-xs space-y-0.5">
                      <div>
                        <span className="font-medium">
                          {Number(post.like || 0)}
                        </span>{" "}
                        <span className="text-muted-foreground">likes</span>
                      </div>
                      <div className="text-muted-foreground">
                        {Number(post.comment_count) || 0} comm.
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {!top.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-28 text-center text-muted-foreground"
                >
                  No posts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-4 px-5 py-3 border-t text-xs text-muted-foreground">
        Showing {top.length} posts
      </div>
    </div>
  );
}
