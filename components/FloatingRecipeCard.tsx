import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Props {
  cls: string;
  image: string;
  text: string;
  rating: number;
}

const FloatingRecipeCard = ({ cls, image, text, rating }: Props) => {
  return (
    <div
      className={`${cls} bg-card text-foreground border border-border/50`}
    >
      <div className="flex items-center space-x-3">
        <Image
          width={100}
          height={100}
          src={image}
          alt="Injera"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-sm leading-snug text-foreground/85">
            {text}
          </h4>
          <div className="flex items-center space-x-1">
            <Star className="text-popular" fill="currentColor" size={20} />
            <span className="text-sm text-muted-foreground">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingRecipeCard;
