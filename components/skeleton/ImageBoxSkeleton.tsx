import { Skeleton } from "../ui/skeleton";



export default function ImageBoxSkeleton() {
  return (
    <div className="w-full h-full">
      <Skeleton className="w-full h-48 sm:h-56 md:h-64 rounded-xl animate-pulse" />
      <Skeleton className="w-2/3 h-4 mt-4 rounded-md animate-pulse" />
    </div>
  );
}