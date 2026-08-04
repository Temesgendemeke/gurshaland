import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { MapPin, StarIcon } from "lucide-react";
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
      className="modern-card modern-card-hover group relative overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={() => router.push(`/restaurant/${restaurant.slug}`)}
    >
      {/* Image Section */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={correctURl(imageSrc)}
          alt={restaurant.name}
          width={500}
          height={300}
          className="w-full h-full object-cover"
          onError={() => setImageSrc("/placeholder.svg")}
        />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm">
          <StarIcon className="w-4 h-4 text-warning" fill="currentColor" />
          <span className="text-sm font-bold text-foreground">
            {restaurant.rating}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3 grow">
        <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {restaurant.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-2">
          {restaurant.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        {/* Location Badge */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary/70" />
          <span className="text-sm font-medium">
            {restaurant.city.length > 30
              ? restaurant.city.slice(0, 30) + "..."
              : restaurant.city}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
