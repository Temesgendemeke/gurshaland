import Link from "next/link";
import { Button } from "./ui/button";

export default function SectionText({
  header,
  description,
  seeMoreLink,
}: {
  header: string;
  description: string;
  seeMoreLink: string;
}) {
  return (
    <div className="flex items-center justify-between mb-8 w-full ">
      <div>
        <h2 className="sm:text-3xl font-bold heading-primary sm:mb-2">
          {header}
        </h2>
        <p className="text-gray-500 text-[10px] sm:text-base w-45 sm:w-auto">
          {description}
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        className="border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm"
      >
        <Link href={seeMoreLink}>View All</Link>
      </Button>
    </div>
  );
}
