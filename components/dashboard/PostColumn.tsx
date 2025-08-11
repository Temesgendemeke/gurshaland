"use client";
import { Post } from "@/utils/types/Dashboard";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { DefaultHeader } from "./DefaultHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, MoreVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";

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
  columnHelper.accessor("slug", {
    header: (info) => <DefaultHeader info={info as any} name="Slug" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: (info) => <DefaultHeader info={info as any} name="Created At" />,
    cell: (info) =>
      info.getValue()
        ? new Date(info.getValue() as string).toLocaleDateString()
        : "",
  }),
  columnHelper.accessor("view", {
    header: (info) => <DefaultHeader info={info as any} name="View" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("like", {
    header: (info) => <DefaultHeader info={info as any} name="Like" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("comments", {
    header: (info) => <DefaultHeader info={info as any} name="Comments" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: (info) => <DefaultHeader info={info as any} name="Status" />,
    cell: (info) => info.getValue(),
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
