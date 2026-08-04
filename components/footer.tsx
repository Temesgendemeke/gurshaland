import Link from "next/link";
import {
  StarIcon as SolidStar,
  HeartIcon as SolidHeart,
} from "@heroicons/react/24/solid";
import Logo from "./Logo";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground w-full mx-auto ">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              {/* <div className="text-xl font-bold text-foreground">
                Gurshaland
              </div> */}
              <Logo />
            </div>
            <p className="leading-relaxed text-xs max-w-[250px] ">
              Sharing the rich culinary heritage of Ethiopia, one recipe at a
              time.
            </p>
            
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Recipes</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories/vegetarian"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Vegetarian
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/meat"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Meat Dishes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/beverages"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Beverages
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/desserts"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Desserts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/spices"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Spices & Sauces
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Culture</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/culture/coffee-ceremony"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Coffee Ceremony
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/dining-traditions"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Dining Traditions
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/festivals"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Food Festivals
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/history"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Culinary History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="hover:text-foreground font-medium transition-colors"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Gurshaland. Made with{" "}
            <SolidHeart className="w-4 h-4 inline text-primary" /> for Ethiopian
            cuisine.
          </p>
        </div>
      </div>
    </footer>
  );
}
