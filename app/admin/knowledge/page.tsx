"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { BrainCircuit, Clock, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface KnowledgeItem {
  id: string;
  text: string;
  created_at: string;
}

const columns: ColumnDef<KnowledgeItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "text",
    header: "Content",
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">
        {row.getValue("text")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: () => (
      <Badge variant="outline" className="capitalize">
        Manual Entry
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Added On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Clock className="w-3 h-3" />
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
];

export default function KnowledgeBasePage() {
  const supabase = createClient();
  const [data, setData] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: items, error } = await supabase
        .from("app_knowledge")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error fetching knowledge base:", error);
        setData([]);
      } else {
        setData(items || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage all context indexed for the AI.
          </p>
        </div>
        <div className="bg-primary/10 p-3 rounded-full">
          <BrainCircuit className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <AdminDataTable columns={columns} data={data} loading={loading} />
      </div>
    </div>
  );
}
