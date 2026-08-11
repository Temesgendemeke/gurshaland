import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
    <div className="mb-8 flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <h2 className="heading-primary mb-1 text-2xl font-bold sm:text-3xl">
          {header}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
      <Link
        href={seeMoreLink}
        className="group inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        See all
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
