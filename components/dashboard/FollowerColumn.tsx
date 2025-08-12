"use client";
import { FollowerColumnType } from "@/utils/types/Dashboard";
import { Profile } from "@/utils/types/profile";
import { Follower } from "@/utils/types/recipe";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { DefaultHeader } from "./DefaultHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVerticalIcon } from "lucide-react";

const columnHelper = createColumnHelper<FollowerColumnType>();

export const FollowerColumn = [
  columnHelper.accessor("username", {
    header: (info) => <DefaultHeader info={info as any} name="Username" />,
    cell: (info) => info.getValue(),
    size: 150,
  }),
  columnHelper.accessor("followed_since", {
    header: (info) => (
      <DefaultHeader info={info as any} name="Followed Since" />
    ),
    cell: (info) =>{
      const data = info.getValue();
      if (!data) return "";

      return new Date(data as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    size: 100,
  }),
  columnHelper.accessor("like", {
    header: (info) => <DefaultHeader info={info as any} name="Like" />,
    cell: (info) => info.getValue(),
    size: 50,
  }),
  columnHelper.accessor("comments", {
    header: (info) => <DefaultHeader info={info as any} name="Comments" />,
    cell: (info) => info.getValue(),
    size: 50,
  }),
];

export default FollowerColumn;
