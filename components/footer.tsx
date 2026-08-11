import Link from "next/link";
import { IconHeart as Heart } from "@tabler/icons-react";
import Logo from "./Logo";

export function Footer() {
  return (
    <footer className="text-muted-foreground w-full mx-auto border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Logo />
            <p className="leading-relaxed text-sm max-w-[15.625rem]">
              Sharing the rich culinary heritage of Ethiopia, one recipe at a
              time.
            </p>
          </div>

          <div>
            <h3 className="font-gosh font-semibold mb-4 text-foreground">Recipes</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories/vegetarian"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Vegetarian
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/meat"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Meat Dishes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/beverages"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Beverages
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/desserts"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Desserts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/spices"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Spices & Sauces
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-gosh font-semibold mb-4 text-foreground">Culture</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/culture/coffee-ceremony"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Coffee Ceremony
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/dining-traditions"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Dining Traditions
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/festivals"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Food Festivals
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/history"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Culinary History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-gosh font-semibold mb-4 text-foreground">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary font-medium transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="hover:text-primary font-medium transition-colors"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 text-center text-muted-foreground border-t border-border">
          <p className="flex items-center justify-center gap-1.5">
            &copy; {new Date().getFullYear()} Gurshaland. Made with
            <Heart className="w-4 h-4 inline text-primary" strokeWidth={2} /> for Ethiopian
            cuisine.
          </p>
        </div>
      </div>
    </footer>
  );
}