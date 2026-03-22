"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, Sparkles } from "lucide-react";
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
  {
    route: "/categories",
    page: "Categories",
  },
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
    return `text-muted-foreground transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`;
  };

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm sticky top-5 z-50 rounded-2xl p-1 border-2 mx-auto w-[calc(100%-1rem)] max-w-screen-2xl">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 py-3">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden 2xl:flex justify-center">
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
              <Sparkles className="w-4 h-4" />
              <span>AI Features</span>
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden 2xl:flex items-center space-x-4 ">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search recipes..."
              className="pl-10 w-64 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background"
            />
          </div> */}

          <CreateAPost />
          <AccountDropDown user={user} />
        </div>

        {/* Mobile Menu */}
        <div className="2xl:hidden col-start-3 justify-self-end flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <AccountDropDown user={user} />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-background/95 backdrop-blur-xl border-t border-border p-4 2xl:hidden">
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Search recipes..."
              className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background"
            />
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
