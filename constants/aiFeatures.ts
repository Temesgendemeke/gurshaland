import { BookOpen, Camera, ChefHat, Heart, MessageCircle, Utensils } from "lucide-react";

const aiFeatures = [
  {
    id: "recipe-generator",
    title: "AI Recipe Generator",
    description:
      "Create authentic Ethiopian recipes from your available ingredients",
    icon: ChefHat,
    color: "from-emerald-500 to-green-600",
    badge: "Popular",
  },
  {
    id: "food-recognition",
    title: "Food Photo Recognition",
    description: "Identify Ethiopian dishes and get recipes instantly",
    icon: Camera,
    color: "from-blue-500 to-indigo-600",
    badge: "Coming Soon",
  },
  {
    id: "cooking-assistant",
    title: "AI Cooking Assistant",
    description: "Get real-time cooking guidance and tips",
    icon: MessageCircle,
    color: "from-purple-500 to-pink-600",
    badge: "Coming Soon",
  },
  {
    id: "meal-planner",
    title: "Smart Meal Planner",
    description: "Plan Ethiopian meals based on your preferences",
    icon: Utensils,
    color: "from-orange-500 to-red-600",
    badge: "Coming Soon",
  },
  {
    id: "nutrition-analyzer",
    title: "Nutrition Analyzer",
    description: "Analyze nutritional content of Ethiopian dishes",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    badge: "Coming Soon",
  },
  {
    id: "recipe-translator",
    title: "Recipe Translator",
    description: "Translate recipes between Amharic and English",
    icon: BookOpen,
    color: "from-teal-500 to-cyan-600",
    badge: "Coming Soon",
  },
];

export default aiFeatures;
