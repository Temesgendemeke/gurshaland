import Link from "next/link";
import {
  StarIcon as SolidStar,
  HeartIcon as SolidHeart,
} from "@heroicons/react/24/solid";

export function Footer() {
  return (
    <footer className="text-white">
      <div className="max-w-9xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 ethiopian-primary rounded-full flex items-center justify-center">
                <SolidStar className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-bold text-white">Gurshaland</div>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Sharing the rich culinary heritage of Ethiopia, one recipe at a
              time.
            </p>
            <div className="flex space-x-4">
              <div className="w-2 h-2 bg-ethiopian-green rounded-full"></div>
              <div className="w-2 h-2 bg-ethiopian-yellow rounded-full"></div>
              <div className="w-2 h-2 bg-ethiopian-red rounded-full"></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Recipes</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  href="/categories/vegetarian"
                  className="hover:text-white font-medium transition-colors"
                >
                  Vegetarian
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/meat"
                  className="hover:text-white font-medium transition-colors"
                >
                  Meat Dishes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/beverages"
                  className="hover:text-white font-medium transition-colors"
                >
                  Beverages
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/desserts"
                  className="hover:text-white font-medium transition-colors"
                >
                  Desserts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/spices"
                  className="hover:text-white font-medium transition-colors"
                >
                  Spices & Sauces
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Culture</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  href="/culture/coffee-ceremony"
                  className="hover:text-white font-medium transition-colors"
                >
                  Coffee Ceremony
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/dining-traditions"
                  className="hover:text-white font-medium transition-colors"
                >
                  Dining Traditions
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/festivals"
                  className="hover:text-white font-medium transition-colors"
                >
                  Food Festivals
                </Link>
              </li>
              <li>
                <Link
                  href="/culture/history"
                  className="hover:text-white font-medium transition-colors"
                >
                  Culinary History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white font-medium transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white font-medium transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white font-medium transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="hover:text-white font-medium transition-colors"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; 2024 Gurshaland. Made with{" "}
            <SolidHeart className="w-4 h-4 inline text-error" /> for Ethiopian
            cuisine.
          </p>
        </div>
      </div>
    </footer>
  );
}
