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
    <div className={cls}>
      <div className="flex items-center space-x-3">
        <Image
          width={100}
          height={100}
          src={image}
          alt="Injera"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-sm heading-primary">{text}</h4>
          <div className="flex items-center space-x-1">
            <Star fill="#FFD700" color="#FFD700" size={18} />
            <span className="text-xs text-body-muted">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingRecipeCard;
