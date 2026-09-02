import {
  BookOpen,
  Camera,
  ChefHat,
  ImagePlus,
  MessageCircle,
  Utensils,
} from "lucide-react";

const aiFeatures = [
  {
    id: "recipe-generator",
    title: "AI Recipe Generator",
    description:
      "Create authentic Ethiopian recipes from your available ingredients",
    icon: ChefHat,
    badge: "Popular",
  },
  {
    id: "food-recognition",
    title: "Food Photo Recognition",
    description: "Identify Ethiopian dishes and get recipes instantly",
    icon: Camera,
    badge: "Coming Soon",
  },
  {
    id: "cooking-assistant",
    title: "AI Cooking Assistant",
    description: "Get real-time cooking guidance and tips",
    icon: MessageCircle,
    badge: "Live",
  },
  {
    id: "/meal-planner",
    title: "Smart Meal Planner",
    description: "Plan Ethiopian meals based on your preferences",
    icon: Utensils,
    badge: "New",
  },
  {
    id: "photo-to-recipe",
    title: "Food Photo to Recipe",
    description:
      "Upload a food photo and turn it into an authentic Ethiopian recipe",
    icon: ImagePlus,
    badge: "New",
  },
  // {
  //   id: "recipe-translator",
  //   title: "Recipe Translator",
  //   description: "Translate recipes between Amharic and English",
  //   icon: BookOpen,
  //   badge: "Coming Soon",
  // },
];
 
export default aiFeatures;
