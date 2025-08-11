import { FollowerColumnType, Post } from "@/utils/types/Dashboard";
import { HeaderContext } from "@tanstack/react-table";
import { SortAsc, SortDesc } from "lucide-react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";

interface DefaultHeaderType {
  info: HeaderContext<Post, any>;
  name: string;
}

export function DefaultHeader<T>({ info, name }: DefaultHeaderType) {
  const sorted = info.column.getIsSorted();
  const { table } = info;
  return (
    <ContextMenu>
      <ContextMenuTrigger
        onPointerDown={(e) => {
          e.preventDefault();
          if (e.button === 2) return;
          info.column.toggleSorting(info.column.getIsSorted() == "asc");
        }}
        className="flex  h-full items-center  gap-2"
      >
        {name}
        {
          <SortAsc
            className={`${sorted == "asc" ? "inline-block" : "hidden"}`}
          />
        }
        {
          <SortDesc
            className={`${sorted == "desc" ? "inline-block" : "hidden"}`}
          />
        }
      </ContextMenuTrigger>
      <ContextMenuContent>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <ContextMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </ContextMenuCheckboxItem>
          ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
