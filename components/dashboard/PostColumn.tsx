"use client";
import { Post } from "@/utils/types/Dashboard";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { DefaultHeader } from "./DefaultHeader";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, MoreVerticalIcon, Eye } from "lucide-react";
import { Button } from "../ui/button";

// Modern Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-300",
          border: "border-emerald-200 dark:border-emerald-700",
          dot: "bg-emerald-500",
        };
      case "draft":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-300",
          border: "border-amber-200 dark:border-amber-700",
          dot: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800/50",
          text: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
          dot: "bg-gray-500",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border} ${config.text} text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></div>
      <span className="capitalize font-semibold tracking-wide">{status}</span>
    </div>
  );
};

const columnHelper = createColumnHelper<Post>();

export const postColumn: ColumnDef<Post, any>[] = [
  // columnHelper.display({
  //   id: "action",
  //   header: ({ table }) => (
  //     <div className="w-6">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select All"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="w-6">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select Row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // }),
  columnHelper.accessor("title", {
    header: (info) => <DefaultHeader info={info as any} name="Title" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: (info) => <DefaultHeader info={info as any} name="Created At" />,
    cell: (info) => {
      const date = info.getValue();
      if (!date) return "";

      return new Date(date as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  }),
  columnHelper.accessor("view", {
    header: (info) => (
      <DefaultHeader info={info as any} name="Engagement Rate" />
    ),
    cell: (info) => {
      const views = Number(info.getValue()) || 0;
      const likes = Number((info.row.original as any).like) || 0;
      const comments = Number((info.row.original as any).comments) || 0;

      let engagementRate = 0;
      if (views > 0) {
        engagementRate = ((likes + comments) / views) * 100;
      }

      
      const displayRate = Math.min(100, Math.round(engagementRate * 100) / 100);

      
      const getEngagementColor = (rate: number) => {
        if (rate >= 15) return "bg-emerald-600"; // High engagement
        if (rate >= 8) return "bg-emerald-500"; // Good engagement
        if (rate >= 5) return "bg-amber-500"; // Moderate engagement
        if (rate >= 2) return "bg-orange-500"; // Low engagement
        return "bg-red-500";
      };

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Eye className="h-3 w-3 text-sm" />
              {views.toLocaleString()} views
            </span>
            <span className="text-[10px] font-medium text-muted-foreground ml-auto">
              {displayRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 rounded bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-r transition-all duration-300",
                getEngagementColor(displayRate)
              )}
              style={{ width: `${displayRate}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground">
            {likes} likes • {comments} comments
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: (info) => <DefaultHeader info={info as any} name="Status" />,
    cell: (info) => <StatusBadge status={info.getValue() as string} />,
  }),
  columnHelper.display({
    id: "more",
    cell: (row) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"ghost"}>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="bg-background"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
