import React from "react";
import { PulseSkeleton } from "@/components/ui/loading-skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

const TableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
      <div className="max-h-[26.25rem] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 border-b border-border/80 bg-card/95 backdrop-blur">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <PulseSkeleton className="h-3 w-8" />
              </TableHead>
              <TableHead>
                <PulseSkeleton className="h-3 w-28" />
              </TableHead>
              <TableHead className="w-32">
                <PulseSkeleton className="ml-auto h-3 w-14" />
              </TableHead>
              <TableHead className="w-44">
                <PulseSkeleton className="ml-auto h-3 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="w-10">
                  <PulseSkeleton className="mx-auto h-3 w-4" delay={i * 0.05} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 pr-4">
                    <PulseSkeleton
                      className="h-3.5 w-48"
                      delay={i * 0.05 + 0.05}
                    />
                    <PulseSkeleton className="h-3 w-32" delay={i * 0.05 + 0.1} />
                  </div>
                </TableCell>
                <TableCell className="w-32">
                  <PulseSkeleton
                    className="ml-auto h-3 w-14"
                    delay={i * 0.05 + 0.15}
                  />
                </TableCell>
                <TableCell className="w-44 pr-4">
                  <div className="flex flex-col items-end gap-1.5">
                    <PulseSkeleton
                      className="h-3 w-24"
                      delay={i * 0.05 + 0.2}
                    />
                    <PulseSkeleton
                      className="h-1 w-32 rounded-full"
                      delay={i * 0.05 + 0.25}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-border/80 px-4 py-2.5">
        <PulseSkeleton className="h-3 w-24" delay={0.5} />
      </div>
    </div>
  );
};

export default TableSkeleton;
