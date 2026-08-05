"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/store/useAuth";
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

  const linkClass = (route: string) => {
    const isActive = pathname === route || pathname.startsWith(`${route}/`);
    return `text-muted-foreground transition-colors ${
      isActive ? "text-primary" : "hover:text-primary"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 py-3">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-center flex-1">
          <nav className="flex items-center font-medium space-x-6">
            {NAV_LINKS.map((navigation, index) => (
              <Link
                key={index}
                href={navigation.route}
                className={linkClass(navigation.route)}
              >
                {navigation.page}
              </Link>
            ))}
            <Link
              href="/ai-features"
              className={`${linkClass("/ai-features")} font-medium flex items-center space-x-1`}
            >
              {/* <Sparkles className="w-4 h-4" /> */}
              <span>AI Features</span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-3 ml-auto">
          <CreateAPost />
          <AccountDropDown user={user} />
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden col-start-3 justify-self-end flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <AccountDropDown user={user} />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border p-4">
          <div className="flex flex-col space-y-4">
            {NAV_LINKS.map((navigation, index) => (
              <Link
                key={index}
                href={navigation.route}
                className={`${linkClass(navigation.route)} font-medium`}
              >
                {navigation.page}
              </Link>
            ))}
            <Link
              href="/ai-features"
              className={`${linkClass("/ai-features")} font-medium flex items-center space-x-1`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Features</span>
            </Link>
            <CreateAPost
              align="start"
              cls="w-[var(--radix-dropdown-menu-trigger-width)]"
            />
          </div>
        </div>
      )}
    </header>
  );
}
