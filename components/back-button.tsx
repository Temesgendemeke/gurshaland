import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  className?: string;
}

export function BackButton({ href, className }: BackButtonProps) {
  return (
    <div className={className}>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border-white/20 hover:bg-primary/40 text-white transition-all shadow-sm hover:text-white"
        asChild
      >
        <Link href={href}>
          <ChevronLeft className="w-5 h-5 -ml-0.5" />
        </Link>
      </Button>
    </div>
  );
}
