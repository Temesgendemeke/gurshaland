import { useState } from "react";
import { useRouter } from "next/navigation";
import { Restaurant } from "@/utils/types/restaurant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { MapPin, StarIcon, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GetRestaurentType } from "@/schema/restaurent";

const RestaurantCard = ({ restaurant }: { restaurant: GetRestaurentType }) => {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(
    restaurant?.image?.url || "/placeholder.svg",
  );

  const correctURl = (url: string) => {
    if (url.includes("https://static.playfood.com/")) {
      return url.replace(/\.com\/\//g, ".com/");
    }

    // if url exists but not working (basic null check)
    if (!url) {
      return "/placeholder.svg";
    }
    return url;
  };

  return (
    <Card
      key={restaurant.id}
      className="group relative overflow-hidden cursor-pointer border-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col backdrop-blur-sm bg-transparent"
      onClick={() => router.push(`/restaurant/${restaurant.slug}`)}
    >
      {/* Accent Border - Animated */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Section */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={correctURl(imageSrc)}
          alt={restaurant.name}
          width={500}
          height={300}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={() => setImageSrc("/placeholder.svg")}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Rating Badge - Floating */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border border-white/20">
          <StarIcon className="w-4 h-4 text-warning" fill="currentColor" />
          <span className="text-sm font-bold text-foreground">
            {restaurant.rating}
          </span>
        </div>

        {/* Hover Arrow Indicator */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <ArrowRight className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3 flex-grow">
        <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {restaurant.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-2">
          {restaurant.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        {/* Location Badge */}
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
            <MapPin className="w-4 h-4 text-primary/70" />
            <span className="text-sm font-medium">
              {restaurant.city.length > 30
                ? restaurant.city.slice(0, 30) + "..."
                : restaurant.city}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500 ease-out" />
    </Card>
  );
};

export default RestaurantCard;
