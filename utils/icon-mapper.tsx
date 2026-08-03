import React from "react";
import {
  CookingPot,
  Utensils,
  Leaf,
  Coffee,
  Cake,
  Beef,
  Fish,
  Apple,
  Carrot,
  Wheat,
  Milk,
  Egg,
  ChefHat,
  Flame,
  Sparkles,
  Star,
  Heart,
  Zap,
  // Add more icons as needed
} from "lucide-react";

// Icon mapping object
const iconMap: { [key: string]: React.ComponentType<any> } = {
  // Food & Cooking
  "cooking-pot": CookingPot,
  utensils: Utensils,
  "chef-hat": ChefHat,
  flame: Flame,
  sparkles: Sparkles,

  // Categories
  beef: Beef,
  fish: Fish,
  leaf: Leaf,
  coffee: Coffee,
  cake: Cake,
  apple: Apple,
  carrot: Carrot,
  wheat: Wheat,
  milk: Milk,
  egg: Egg,

  // General
  star: Star,
  heart: Heart,
  zap: Zap,

  // Default fallback
  default: CookingPot,
};

// Function to get icon component by name
export const getIconComponent = (iconName: string) => {
  const IconComponent = iconMap[iconName?.toLowerCase()] || iconMap["default"];
  return IconComponent;
};

// Function to render icon with props
export const renderIcon = (iconName: string, props?: any) => {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent {...props} />;
};

// Export the icon map for direct access if needed
export { iconMap };
