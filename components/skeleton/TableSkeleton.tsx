import React from "react";
import {
  LoadingSkeleton,
  ShimmerSkeleton,
  PulseSkeleton,
} from "@/components/ui/loading-skeleton";
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
    <div className="relative rounded-xl border bg-card/50 backdrop-blur shadow-sm overflow-hidden">
      {/* Subtle shimmer overlay */}
      <ShimmerSkeleton className="absolute inset-0 opacity-20 pointer-events-none" />
      {/* Header skeleton with shimmer */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <ShimmerSkeleton className="h-6 w-32 bg-emerald-100 dark:bg-emerald-900/30 rounded">
          <PulseSkeleton className="h-6 w-32 bg-transparent" />
        </ShimmerSkeleton>
        <PulseSkeleton className="h-4 w-24" delay={0.3} />
      </div>

      {/* Table skeleton */}
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
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow
                key={i}
                className="group transition-all duration-300 hover:bg-muted/20"
              >
                <TableCell className="text-center">
                  <PulseSkeleton
                    className="h-6 w-6 rounded-md mx-auto"
                    delay={i * 0.1}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 pr-4">
                    <PulseSkeleton
                      className="h-4 w-48"
                      delay={i * 0.1 + 0.05}
                    />
                    <PulseSkeleton className="h-3 w-32" delay={i * 0.1 + 0.1} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <PulseSkeleton
                          className="h-3 w-3 rounded-full"
                          delay={i * 0.1 + 0.15}
                        />
                        <PulseSkeleton
                          className="h-3 w-12"
                          delay={i * 0.1 + 0.2}
                        />
                      </div>
                      <PulseSkeleton
                        className="h-3 w-8"
                        delay={i * 0.1 + 0.25}
                      />
                    </div>
                    <PulseSkeleton
                      className="h-2 w-full rounded"
                      delay={i * 0.1 + 0.3}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex flex-col gap-1 items-end">
                    <PulseSkeleton
                      className="h-3 w-16"
                      delay={i * 0.1 + 0.35}
                    />
                    <PulseSkeleton className="h-3 w-20" delay={i * 0.1 + 0.4} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-end gap-4 px-5 py-3 border-t">
        <PulseSkeleton className="h-3 w-24" delay={0.5} />
      </div>
    </div>
  );
};

export default TableSkeleton;
