import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[20rem] grid-cols-1 gap-4 sm:grid-cols-3 sm:auto-rows-[22rem]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
      className,
    )}
    {...props}
  >
    <div className="relative flex-1">
      <div className="absolute inset-0">{background}</div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
    </div>

    <div className="relative z-10 flex flex-col gap-3 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex w-full translate-y-full items-center bg-card/95 p-4 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto text-primary hover:text-primary">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
