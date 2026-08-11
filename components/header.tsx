"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useAuth } from "@/store/useAuth";
import { cn } from "@/lib/utils";
import AccountDropDown from "./AccountDropDown";
import CreateAPost from "./CreateAPost";
import Logo from "./Logo";

const NAV_LINKS = [
  {
    route: "/recipes",
    page: "Recipes",
  },
  // {
  //   route: "/categories",
  //   page: "Categories",
  // },
  {
    route: "/blog",
    page: "Blog",
  },
  {
    route: "/restaurant",
    page: "Discover Restaurants",
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuth((state) => state.user);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  const linkClass = (route: string) =>
    cn(
      "relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
      "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-out",
      isActive(route)
        ? "text-primary after:scale-x-100"
        : "hover:text-primary hover:after:scale-x-100",
    );

  const mobileLinkClass = (route: string) =>
    cn(
      "block rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
      isActive(route)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="ml-8 hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((navigation) => (
            <Link
              key={navigation.route}
              href={navigation.route}
              className={linkClass(navigation.route)}
            >
              {navigation.page}
            </Link>
          ))}
          <Link
            href="/ai-features"
            className={`${linkClass("/ai-features")} flex items-center gap-1.5`}
          >
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            AI Features
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <CreateAPost />
          <AccountDropDown user={user} />
        </div>

        {/* Mobile Actions */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <AccountDropDown user={user} />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden lg:hidden"
          >
            <div className="space-y-1 border-t border-border/60 bg-background px-4 py-4">
              {NAV_LINKS.map((navigation) => (
                <Link
                  key={navigation.route}
                  href={navigation.route}
                  className={mobileLinkClass(navigation.route)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navigation.page}
                </Link>
              ))}
              <Link
                href="/ai-features"
                className={`${mobileLinkClass("/ai-features")} flex items-center gap-1.5`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                AI Features
              </Link>
              <div className="pt-2">
                <CreateAPost
                  align="start"
                  cls="w-[var(--radix-dropdown-menu-trigger-width)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
