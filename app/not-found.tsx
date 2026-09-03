import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
     

      {/* Title */}
      <h1 className="font-gosh text-6xl font-black tracking-tight text-foreground sm:text-7xl">
        404
      </h1>

      <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild className="rounded-full px-6">
          <Link href="/recipes">Browse Recipes</Link>
        </Button>
      </div>
    </div>
  );
}
